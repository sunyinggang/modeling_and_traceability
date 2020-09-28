#encoding=UTF-8
'''村淘简易模式'''



import collections


from bbn_tool import *
import Queue




# 解析传入json
def json_trans(conds):
    conds_ret = dict()
    dag = conds.get('dag')
    table = conds.get('table')
    # 输出子节点和父节点的元组，元组构成list
    variables_fathers=dag.items()
    # i为子节点和父节点的元组
    for i in variables_fathers:
        if len(i[1])==0:
            list_of_noneAndP=[[],table.get(i[0])]
            conds_ret.update({i[0]: [list_of_noneAndP]})
        else:
            dict_of_TT=table.get(i[0])
            # kv为条件以及条件概率组成的元组
            for kv in dict_of_TT.items():
                condition=kv[0]
                c=0
                list_of_vc = []
                # 将父节点和父节点状态组成列表
                for father in i[1]:
                    list_of_vc.append([father,condition[c]])
                    c=c + 1
                list_of_vcAndP=[list_of_vc, kv[1]]
                if i[0] not in conds_ret:
                    li = []
                    conds_ret.update({i[0]:li})
                conds_ret[i[0]].append(list_of_vcAndP)

    return conds_ret


def bfs(dag,tab_ret,dic_x,dic_y,rest_y):
    # 图结构
    list_start=[]
    for start_item in dic_y.items():
        list_start.append(start_item[0])
    list_res = []
    visited = set()
    q=Queue.Queue()

    for start in list_start:
        q.put(start)
        list_tmp=[]
        while not q.empty():
            u = q.get()
            list_tmp.append(u)
            for v in dag.get(u):
                tab=[]
                for id_tab in tab_ret:
                    # 查找名为v的概率表
                    if id_tab['id']==v:
                        tab=id_tab['table']

                if v not in visited:
                    for single_cond in tab:
                        # 关键，标红的条件
                        if v in dic_x.keys():
                            if dic_x[v] == single_cond[0] and 0.3 < float(single_cond[1]):
                                visited.add(v)
                                q.put(v)
        list_res.append(list_tmp)
    return list_res


# 返回[{"id":X2},{"id":X1},.....]
def dot_ret(cond):
    dag = cond.get('dag')
    list_dot = []
    for i in dag.keys():
        temp = dict()
        temp['id'] = i
        list_dot.append(temp)
    return list_dot


# 返回[{'id'=X1,
#     'table'=[[],[]]},....]
def tab_ret(cond, marginals, dic_y):
    dag = cond.get('dag')
    list_tab = []
    list_start = []
    for start_item in dic_y.items():
        list_start.append(start_item[0])
    # 获取节点名称
    for i in dag.keys():
        temp = collections.OrderedDict()
        temp['id'] = i
        marg_tab = []
        # 获取对应节点的概率表格
        # marg_tuple为((node_name,degree),conditional)
        marg_tab.append(['程度', '概率'])
        for marg_tuple in marginals.items():
            if marg_tuple[0][0] == i:
                marg_list = [marg_tuple[0][1], ("%.2f" % marg_tuple[1])]
                marg_tab.append(marg_list)
        temp['table']=marg_tab
        if i in list_start:
            ch=dic_y[i]
            print ch
            print type(ch)
            chinese=ch[1]
            temp['table']=[['注意:',chinese]]
        list_tab.append(temp)
    return list_tab

#返回边
def edge_ret(cond):
    list_edge=cond.get('edges')
    return list_edge



def out(cond,dic_x,dic_y,rest_y):
    UP = json_trans(cond)
    g = build_bbn_from_conditionals(UP)
    # 去除中文过高过低的指标值，只留下{'11':'2'},11指指标序号，2指指标的程度
    dic_y_q={}
    for i in dic_y.items():
        dic_y_q[i[0]]=i[1][0]
    marginals=g.query(dic_y_q)
    dots=dot_ret(cond)
    tabs=tab_ret(cond, marginals, dic_y)
    dag=cond.get('dag')
    bfs_sequence=bfs(dag,tabs,dic_x,dic_y_q,rest_y)
    ret = {}
    edges = edge_ret(cond)
    ret['tables'] = tabs
    ret['dots'] = dots
    ret['edges'] = edges
    ret['sequence'] = bfs_sequence
    return ret


