import json
import numpy as np
import csv
import pandas as pd


def find_parent(point):
    parent = []
    for i in range(len(point)):
        if point[i] == 1:
            parent.append(i)
    return parent


def write_json(dag, categories, probability_table, ret_out):
    ret_json = {}
    ret_json["dag"] = {}
    ret_json["table"] = {}
    dag = np.transpose(dag)
    for i in range(len(dag)):
        point = dag[i]
        parent = find_parent(point)
        parent = [categories[x] for x in parent]
        ret_json["dag"][categories[i]] = parent
    ret_json["table"] = probability_table
    # print(ret_json)
    with open(ret_out, "w") as f:
        json.dump(ret_json, f, indent=4)
        # ret.json文档中文正常显示
        #json.dump(ret_json, f, indent=4, ensure_ascii=False)
    return ret_json


def read_data(file_name):
    with open(file_name, "r") as f:
        csv_reader = csv.reader(f)
        col_names = next(csv_reader)
        lines = []
        for line in csv_reader:
            line = [float(l) for l in line]
            lines.append(line)
        # 创建表类数据结构，columns指定列明
        df = pd.DataFrame(lines, columns=col_names)
    return df
