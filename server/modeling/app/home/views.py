import csv
import os
import numpy as np

from flask import jsonify, request
from sqlalchemy import and_
from app import app
from . import home
from .. import db
from ..models import Varinfo as varinfo, TmpVarinfo as tmp_varinfo, Gq as gq, Value as value, GqGq as gq_gq, VGq as v_gq
from ..utils.comon import find_row, int_to_ch, parent_state_product
from ..utils.data_tool import cal_corr, discretize
from ..utils.file_tool import read_data, write_json
from ..utils.model_tool import get_dag, get_probability


@home.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin']='*'
    environ.headers['Access-Control-Allow-Method']='*'
    environ.headers['Access-Control-Allow-Headers']='x-requested-with,content-type'
    return environ

# step1:获取系统预设的X指标与Y指标
@home.route("/getvar/")
def get_varinfo():
    ret_json = []
    vars = varinfo.query.all()
    for var in vars:
        var_info = {}
        var_info["id"] = var.id
        var_info["name"] = var.qualityParameterName
        var_info["type"] = var.varType
        ret_json.append(var_info)

    return jsonify(ret_json)

# step2:获取用户改变之后的x指标和y指标，并且将所有y指标的最大值、最小值以及极性等信息返回
@home.route("/classfication/", methods=['POST'])
def get_classfication():
    class_list = request.get_json()
    for var in class_list:
        tmp_var_count = tmp_varinfo.query.filter_by(id=var["id"]).count()
        if tmp_var_count == 1:
            tmp_var = tmp_varinfo.query.filter_by(id=var["id"]).first()
            tmp_var.qualityParameterName = var["name"]
            tmp_var.varType = var["type"]
        else:
            tmp_var = tmp_varinfo(id=var["id"], qualityParameterName=var["name"], varType=var["type"])

        db.session.add(tmp_var)
        db.session.commit()

    y_list = tmp_varinfo.query.filter_by(varType="y")
    ret_json =[]
    for var in y_list:
        tmp_var = {}
        tmp_var["id"] = var.id
        tmp_var["name"] = var.qualityParameterName
        # 通过遍历每一个存放指标信息的表（价值表、全局质量表）获取指标的最大值、最小值以及极性等信息
        # 将表对应的类存入list，准备在循环内使用
        db_tables = []
        db_tables.append(value)
        db_tables.append(gq)
        record = None
        i = 0
        # 遍历表，直到该指标在该表中出现
        while record is None:
            record = db_tables[i].query.filter_by(qualityParameterName=tmp_var["name"])
            l = len(record.all())
            if len(record.all()) == 0:
                i = i + 1
                record = None
        record = record[0]
        # 获取指标信息
        tmp_var["min"] = record.lowerBoundValue
        tmp_var["max"] = record.upperBoundValue
        tmp_var["unit"] = record.unit
        tmp_var["dir"] = record.dir

        ret_json.append(tmp_var)
        print(ret_json)

    return jsonify(ret_json)

# step3:获取用户输入的y指标离散的分界值存入数据库中，将数据集中的y指标先做二值离散
@home.route("/dis-y/", methods=['POST'])
def discretize_y():
    y_list = request.get_json()
    for var in y_list:
        tmp_var = tmp_varinfo.query.filter_by(id=var["id"]).first()
        tmp_var.disv = var["disv"]
        tmp_var.dir = var["dir"]
        db.session.add(tmp_var)
        db.session.commit()
    # 将数据中的y指标先做二分离散
    origin_data_path = os.path.join(app.config['STATIC_DIR'], "data", "dataorigin.csv")
    des_data_path = os.path.join(app.config['STATIC_DIR'], "data", "datadisy.csv")
    # 打开文件 "w" 代表重写
    print(des_data_path)
    # 打开文件 "w" 代表重写
    with open(des_data_path, "w", newline="") as outfile:
        csv_writer = csv.writer(outfile)
        with open(origin_data_path, "r") as infile:
            # csv格式文件按行读->返回列表
            csv_reader = csv.reader(infile)
            # 读取文件第一行
            header = next(csv_reader)
            # 将header写入datadisy.csv
            csv_writer.writerow(header)
            # 此时的row是从文件的第二行开始
            for row in csv_reader:
                # 将每一行的每个数据转为浮点数，保留完整小数  -》 数字e+01代表10的1次幂，e-01代表10的-1次幂
                row_data = [float(l) for l in row]
                # 数值小于等于分界值，则置为1，否则置为2
                for var in y_list:
                    index = int(var["id"]) - 1
                    # disv = float(var["min"])
                    disv = float(var["disv"])
                    row_data[index] = 1 if row_data[index] <= disv else 2  # python三目运算
                csv_writer.writerow(row_data)

    # 找出x指标相关的y指标，并将y指标名以及id和x指标名、id以及相关关系打包返回
    ret_json = {}
    # 打包y指标信息
    y_vars = []
    y_varinfos = tmp_varinfo.query.filter_by(varType="y")
    for y_var in y_varinfos:
        tmp_var = {}
        tmp_var["id"] = y_var.id
        tmp_var["name"] = y_var.qualityParameterName
        y_vars.append(tmp_var)
    # y_vars是只含有id与name的y指标信息
    ret_json["y"] = y_vars

    # 打包x指标信息
    x_vars = []
    x_varinfos = tmp_varinfo.query.filter_by(varType="x")
    # x指标需要在数据库中所有指标表（价值表、全局质量表）中遍历，寻找x存在于哪个表中
    db_tables = [
        {
            "db": gq,  # 全局质量表
            "query": [
                {
                    "src": gq_gq,  # 若x位于全局质量表，则在此表中寻找相关关系
                    "des": gq  # 若x位于全局质量表，则在此表中寻找相关指标名称
                }
            ]
        },
        {
            "db": value,  # 价值表
            "query": [
                {
                    "src": v_gq,  # 同上
                    "des": gq  # 同上
                }
            ]
        },
    ]
    # 对所有x指标做相同操作，获取x指标信息
    for x_var in x_varinfos:
        tmp_var = {}
        tmp_var["id"] = x_var.id
        tmp_var["name"] = x_var.qualityParameterName

        tmp_var["rel"] = []
        row = -1
        # 找出x指标位于哪个表中
        for ele in db_tables:
            obj = ele["db"]
            row = find_row(obj.query.all(), x_var.qualityParameterName)
            if row != -1:
                break
        # 获取x指标后续所需查询的表的信息
        query_list = ele["query"]
        for que in query_list:
            srcdb = que["src"]
            desdb = que["des"]
            # 找出所有与x有关的指标
            rels = srcdb.query.filter(and_(srcdb.qualityParameterNameRow == row, srcdb.valueQualityType != 0)).all()
            rels_names = []
            for rel in rels:
                rels_names.append(desdb.query.all()[int(rel.qualityParameterNameRank)].qualityParameterName)
            # 找出所有的y指标
            y_vars = tmp_varinfo.query.filter_by(varType="y")
            y_names = [y_var.qualityParameterName for y_var in y_vars]
            # 获取y指标和相关关系指标的交集，才为x指标可以用来离散使用的y指标
            rels_names = list(set(rels_names) & set(y_names))
            tmp_var["rel"] = tmp_var["rel"] + rels_names
        x_vars.append(tmp_var)
    ret_json["x"] = x_vars
    print(ret_json)
    return jsonify(ret_json)

# step4:获取用户更改后的指标相关关系，将与其相关的指标名转换为指标id，并将其存入数据库中 =》x指标的rel属性值
@home.route("/relation-x-y/", methods=['POST'])
def relation_x_y():
    var_rel = request.get_json()
    x_list = var_rel["x"]

    for var in x_list:
        rel_names = var["rel"]
        # print(rel_names)
        rel_id = []
        for rel_name in rel_names:
            rel_id.append(str(tmp_varinfo.query.filter_by(qualityParameterName=rel_name).first().id))
        tmp_rel = " ".join(rel_id)
        tem_var = tmp_varinfo.query.filter_by(id=var["id"]).first()
        tem_var.rel=tmp_rel
        db.session.add(tem_var)
        db.session.commit()

    ret_json = {
        "ret": "success"
    }
    return jsonify(ret_json)

# step5:获取用户想要使用的方法及相关参数
# 根据用户的选择，将x指标离散为二值或三值，改写数据集中x指标的值
# 根据用户选择的方法构建模型，并打包为相应的json数据返回
@home.route("/construct/", methods=['POST'])
def construct_model():
    post_data = request.get_json()
    state_num = int(post_data["method"].split("-")[1])
    print(state_num)

    # 将x指标离散，并改写数据集
    x_vars = tmp_varinfo.query.filter_by(varType="x")
    rels = {}
    x_ids = []
    for x_var in x_vars:
        rels[x_var.id] = [int(l) for l in x_var.rel.split()]
        x_ids.append(x_var.id)
    origin_data_path = os.path.join(app.config['STATIC_DIR'], "data", "dataorigin.csv")
    # 转为pd.DataFrame
    origin_data = read_data(origin_data_path)
    # 通过原始数据计算相关系数，避免有些指标没有相关指标，从而不能离散
    corr_matrix = cal_corr(origin_data)
    # array()将数据转化为矩阵；tolist()用于将数组或矩阵转为列表
    corr_list = np.array(corr_matrix).tolist()
    # 获取y指标的id
    y_vars = tmp_varinfo.query.filter_by(varType="y").all()
    y_ids = [y_var.id for y_var in y_vars]
    # 使用x指标的id以及y指标的id查询相关系数矩阵，为用户没有选择相关关系的x指标寻找相关的y指标 =>即判断x指标的rel是否为空，为空时给添加
    for key in rels:
        if len(rels[key]) == 0:
            corr_id = []
            for id in y_ids:
                if corr_list[key][id] == 1:
                    corr_id.append(id)
            rels[key] = corr_id
    # 使用y指标已经被离散过的数据以及x指标和y指标的相关关系离散x指标
    dis_data_path = os.path.join(app.config['STATIC_DIR'], "data", "datadisy.csv")
    # 转为pd.DataFrame
    dis_data = read_data(dis_data_path)

    rvs_split_points = discretize(x_ids, rels, dis_data, state_num)
    print(rvs_split_points)
    # print(rvs_split_points)
    # 使用离散x指标的分界值改写数据集
    des_data_path = os.path.join(app.config['STATIC_DIR'], "data", "datafinal.csv")
    with open(des_data_path, "w", newline="", encoding="utf-8") as outfile:
        csv_writer = csv.writer(outfile)
        with open(dis_data_path, "r") as infile:
            csv_reader = csv.reader(infile)
            header = next(csv_reader)
            csv_writer.writerow(header)
            for row in csv_reader:
                # 数值在分界值区间内分别为1、2、3
                for key in rvs_split_points:
                    # 改写数据集
                    index = key - 1
                    for i in range(state_num - 1):
                        row[index] = (i + 1) if float(row[index]) <= rvs_split_points[key][i] else (i + 2)
                csv_writer.writerow(row)
    # 更新数据库
    for key in rvs_split_points:
        disv = [str(l) for l in rvs_split_points[key]]
        disv = " ".join(disv)
        tmp_var = tmp_varinfo.query.filter_by(id=key).first()
        tmp_var.disv=disv
        db.session.add(tmp_var)
        db.session.commit()

    # 根据用户选择的方法构建模型
    data_set = os.path.join(app.config['STATIC_DIR'], "data", "datafinal.csv")
    ret_out = os.path.join(app.config['STATIC_DIR'], "data", "ret.json")
    # genfromtxt将每个非空行拆分为一个字符串序列,delimiter:定义拆分应如何进行;max_rows;最多拆几行;dtype:输出类型
    categories = np.genfromtxt(data_set, encoding="utf-8", delimiter=',', max_rows=1, dtype=str)
    data = np.genfromtxt(data_set, dtype='int64', encoding="utf-8", delimiter=',', skip_header=True)
    tmp_name = []
    for i in range(len(categories)):
        tmp_name.append(tmp_varinfo.query.filter_by(id=categories[i]).first().qualityParameterName)
    categories = tmp_name

    dag, score = get_dag(data)
    probability_table = get_probability(dag, categories, data)

    graph_json = write_json(dag, categories, probability_table, ret_out)

    # 根据构建所得模型打包返回数据
    ret_json = {}
    # 打包点集
    ret_json["dots"] = list(categories)
    # 打包边集
    ret_json["edges"] = []
    graph_con = graph_json["dag"]
    for point in categories:
        parents = graph_con[point]
        for parent in parents:
            tmp_edge = {
                "source": parent,
                "target": point
            }
            ret_json["edges"].append(tmp_edge)
    # 打包每个节点对应的概率表
    ret_json["tables"] = []
    graph_table = graph_json["table"]
    # 对每个节点进行操作
    for point in categories:
        # 此情况下，节点为初始节点，无父节点
        if len(graph_con[point]) == 0:
            tmp_table = {}
            tmp_table["dot"] = point
            tmp_table["table"] = [["节点取值", "先验概率"]]
            point_table = graph_table[point]
            for i in range(state_num):
                state_str = int_to_ch(i + 1, state_num)
                tmp_table["table"].append([state_str, point_table[str(i + 1)]])
            ret_json["tables"].append(tmp_table)
        # 此情况下，节点有父节点
        else:
            tmp_table = {}
            tmp_table["dot"] = point
            tmp_table["table"] = []
            parents = graph_con[point]
            point_table = graph_table[point]
            # 获取父节点状态的全集组合
            parent_state = []
            for i in range(len(parents)):
                parent_state.append(state_num)
            parent_state = parent_state_product(parent_state)
            # 遍历父节点状态的全集组合
            # titles = []
            for state_p in parent_state:
                # 获取当前父节点状态的组合，以及表格中该字段名称
                tmp_row = []
                states = state_p.split()
                title = ""
                for i in range(len(parents)):
                    state_str = int_to_ch(states[i], state_num)
                    title = title + parents[i] + ":" + state_str + " " + "\r\n"
                tmp_row.append(title)
                states = "".join(states)
                # 父节点状态组合值在模型中，则遍历子节点状态
                if states in point_table:
                    for i in range(state_num):
                        # 子节点状态值在模型中，则取值赋给表格
                        if str(i + 1) in point_table[states]:
                            tmp_row.append(str(point_table[states][str(i + 1)]))
                        # 子节点状态值不在模型中，则取值为0赋给表格
                        else:
                            tmp_row.append("0")
                # 父节点状态组合值不在模型中，则子节点状态全部赋值为0
                else:
                    for i in range(state_num):
                        tmp_row.append("0")
                tmp_table["table"].append(tmp_row)
            # 最后补充表格头
            head = [""]
            for i in range(state_num):
                state_str = int_to_ch(i + 1, state_num)
                head.append(state_str)
            # print(head)
            tmp_table["table"].insert(0, head)
            tmp_np_array = np.array(tmp_table["table"])
            # 根据显示需要，转置表格
            # tmp_np_array = tmp_np_array.transpose()
            tmp_table["table"] = tmp_np_array.tolist()
            ret_json["tables"].append(tmp_table)
    print("---------------")
    print(ret_json)
    print("---------------")
    return jsonify(ret_json)

@home.route("/use-model/")
def use_model():
    ret_json = {}
    # 根据用户选择的方法构建模型
    data_set = os.path.join(app.config['STATIC_DIR'], "data", "datafinal.csv")
    ret_out = os.path.join(app.config['STATIC_DIR'], "data", "ret.json")
    # genfromtxt将每个非空行拆分为一个字符串序列,delimiter:定义拆分应如何进行;max_rows;最多拆几行;dtype:输出类型
    categories = np.genfromtxt(data_set, encoding="utf-8", delimiter=',', max_rows=1, dtype=str)
    categories_num = categories.tolist()
    data = np.genfromtxt(data_set, dtype='int64', encoding="utf-8", delimiter=',', skip_header=True)
    dag, score = get_dag(data)
    probability_table = get_probability(dag, categories_num, data)
    # graph_json['dag'] ;graph_json['table']
    graph_json = write_json(dag, categories, probability_table, ret_out)
    ret_json["dag"] = graph_json['dag']
    ret_json["table"] = graph_json['table']
    ret_json["edges"] = []
    graph_con = graph_json["dag"]
    for point in categories:
        parents = graph_con[point]
        for parent in parents:
            tmp_edge = {
                "source": parent,
                "target": point
            }
            ret_json["edges"].append(tmp_edge)

    return jsonify(ret_json)
