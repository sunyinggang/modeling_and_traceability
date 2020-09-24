# 通用的一些处理方法


def find_row(records, name):
    """
    在一个数据记录列表中，找出该指标名称在该列表中出现的位置，若返回-1表示该指标未出现过
    :param records:
    :param name:
    :return:
    """
    for i in range(len(records)):
        if records[i].qualityParameterName == name:
            return i
    return -1


def parent_state_product(parent_states):
    """
    产生节点父节点状态的全集，即每个父节点状态的可能取值的笛卡儿积
    :param parent_states:
    :return:
    """
    parent_num = len(parent_states)
    ret_state = [""]
    for i in range(parent_num):
        a = ret_state
        b = range(1, parent_states[i] + 1)
        ret_state = [f"{a[j]}{b[k]} " for j in range(len(a)) for k in range(len(b))]
    return ret_state


def int_to_ch(state, state_num):
    """
    将状态id值转为中文标注
    :param state:
    :param state_num:
    :return:
    """
    state_str = ""
    state = int(state)
    if state_num == 2 and state == 1:
        state_str = "低"
    elif state_num == 2 and state == 2:
        state_str = "高"
    elif state_num == 3 and state == 1:
        state_str = "低"
    elif state_num == 3 and state == 2:
        state_str = "中"
    elif state_num == 3 and state == 3:
        state_str = "高"
    return state_str