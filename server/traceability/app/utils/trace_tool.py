# coding=UTF-8
from flask import jsonify

from app.models import TmpVarinfo


def listtodict(ret):
    """
    存y的故障
    :param ret:
    :return:
    """
    # 按规定字段查询所有数据
    mc= TmpVarinfo.query.with_entities(TmpVarinfo.varType, TmpVarinfo.disv, TmpVarinfo.dir).all()
    print (mc)
    # print(mc)
    i=1
    # 发生故障的y
    dic_y={}
    # 未发生故障的y
    rest_y={}
    for var in mc:
        print (var[2])
        if var[0] == 'y':
            if var[2] == str('负').decode('utf-8'):
                if float(var[1]) < ret[i-1]:
                    dic_y[str(i)] = ['2','过高']
                else:
                    # '1'为正常，这里要将剩余的y的异常存入
                    rest_y[str(i)]='2'
            if var[2] == str('正').decode('utf-8'):
                # print(type(var[1]))
                # print(var[1])
                if float(var[1])>ret[i-1]:
                    dic_y[str(i)]=['1','过低']
                else:
                    # '2'为正常，这里要将剩余的y的异常存入
                    rest_y[str(i)] = '1'
        i=i+1
    # print(dic_y)
    dic_rest_y=[dic_y,rest_y]
    return dic_rest_y



def getdict_x(ret):
    """
    # 存x对应的故障
    :param ret:
    :return:
    """
    mc = TmpVarinfo.query.with_entities(TmpVarinfo.varType, TmpVarinfo.disv, TmpVarinfo.dir).all()
    i = 1
    dic_x = {}
    # 为什么要判断第一个？
    if len(mc[0][1].split(',')) == 1:
        flag = 0
    else:
        flag = 1
    if flag == 0:
        for var in mc:
            if var[0] == 'x':
                if var[2] == str('负').decode('utf-8'):
                    dic_x[str(i)] = '2'
                if var[2] == str('正').decode('utf-8'):
                    dic_x[str(i)] = '1'
            i = i + 1
    else:
        for var in mc:
            if var[0] == 'x':
                if str('负').decode('utf-8'):
                    dic_x[str(i)] = '3'
                if var[2] == str('正').decode('utf-8'):
                    dic_x[str(i)] = '1'
            i = i + 1
    return dic_x

def transtoChinese(dic_en):
    id_name=dict()
    mc = TmpVarinfo.query.with_entities(TmpVarinfo.id, TmpVarinfo.qualityParameterName).all()
    for i in mc:
        # {'11'：'商品质量'}
        id_name[str(i[0])]=i[1]
    dots=dic_en.get('dots')
    for dot in dots:
        for key in id_name.keys():
            if dot['id'] == key:
                dot['id']=id_name[key]
    tables = dic_en.get('tables')
    for table in tables:
        for key in id_name.keys():
            if table['id'] == key:
                table['id'] = id_name[key]
    sequence = dic_en.get('sequence')
    sequence_ret=[]
    for s_dots in sequence:
        sequence_1 = []
        for dot in s_dots:
            for key in id_name.keys():
                if dot == key:
                    sequence_1.append(id_name[key])
        sequence_ret.append(sequence_1)
    dic_en['sequence']=sequence_ret
    edges= dic_en.get('edges')
    for edge in edges:
        for key in id_name.keys():
            if edge['source']==key:
                edge['source']=id_name[key]
            if edge['target']==key:
                edge['target']=id_name[key]
    return jsonify(dic_en)
