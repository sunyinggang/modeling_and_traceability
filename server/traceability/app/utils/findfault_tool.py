#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
import os

import pymysql
import csv
import numpy as np
from flask import jsonify

# 取消科学计数法
from app import app

np.set_printoptions(suppress=True)

def read_txt():
    data = []
    out=[]
    # txt_data = os.path.join(app.config['STATIC_DIR'], "data", "1111.txt")
    # csv_input = os.path.join(app.config['STATIC_DIR'], "data", "data.csv")
    txt_data = os.path.join(app.config['STATIC_DIR'], "data", "xx1111.txt")
    csv_input = os.path.join(app.config['STATIC_DIR'], "data", "xxdata.csv")
    f = open(txt_data)
    temp = csv.reader(f)
    headers = next(temp)  # 此行去除列名
    for row in temp:
        data.append(row)
    csvfile = open(csv_input, 'wb+')
    writer = csv.writer(csvfile)  # 固定格式
    # 对csvRow通过append()或其它命令添加数据
    for csvRow in data:
        for l in csvRow:
            x = l.split()
            for s in range(len(x)):
                # 每个数据值转为浮点数
                x[s] = float('{:.2f}'.format(float(x[s])))

        writer.writerow(x)  # 将csvRow中数据写入csv文件中
        out.append(x)
    header=headers[0].split()
    out.insert(0, header)
    return jsonify(out)







