import math
import numpy as np

# Find the minimal total_entropy in the list to find the split_point
# Entropy_list is a list of tuple, tuple is like (index, total_entropy, left_entropy, right_entropy)
def find_min_entropy_point(entropy_list):
    if len(entropy_list) == 0:
        return
    else:
        current_min_entropy = entropy_list[0][1]
        split_point = entropy_list[0]
        for ele in entropy_list[1:]:
            if ele[1] <= current_min_entropy:
                current_min_entropy = ele[1]
                split_point = ele
        return split_point


# Find the max entropy to find the next target interval which to be processed
def find_max_entropy_interval(split_intervals):
    current_max_entropy = split_intervals[0][2]
    target_interval = split_intervals[0]
    for ele in split_intervals[1:]:
        if ele[2] > current_max_entropy:
            current_max_entropy = ele[2]
            target_interval = ele
        # If two intervals have the same entropy, we choose the larger interval
        elif ele[2] == current_max_entropy:
            ele_len = ele[1] - ele[0]
            target_interval_len = target_interval[1] - target_interval[0]
            if ele_len > target_interval_len:
                current_max_entropy = ele[2]
                target_interval = ele
    return target_interval


# Find the split points to split the rv_list according to the entropy
def find_split_points(value_kind_list, max_interval_num):
    # Init the number of the split intervals, the list of the split intervals and the list of the split points
    # At the first, the split_intervals is the whole value_kind_list
    current_interval_num = 1
    split_intervals = [(0, len(value_kind_list) - 1, 0)]
    split_points = []

    while current_interval_num < max_interval_num:
        # Find the intervals which has the max entropy to split
        target_interval = find_max_entropy_interval(split_intervals)
        current_start_point = target_interval[0]
        current_end_point = target_interval[1]

        # Init two dictionaries to record the number of different kinds of instances
        # in the left interval and the right interval
        left_interval = {}
        right_interval = {}

        # Put all instances in the right_interval
        for i in range(current_start_point, current_end_point + 1):
            ele_kind = value_kind_list[i][1]
            if ele_kind in right_interval:
                right_interval[ele_kind] = right_interval.get(ele_kind) + 1
            else:
                right_interval[ele_kind] = 1

        # Init the list to record the index of alternative split_point, total_entropy, left_entropy and right_entropy
        entropy_list = []

        # Traverse each element and calculate the entropy value of this element as a split point
        for i in range(current_start_point, current_end_point + 1):
            # Pick a element from the right interval as a split point in order and put it in the left interval
            ele_kind = value_kind_list[i][1]
            if ele_kind in left_interval:
                left_interval[ele_kind] = left_interval.get(ele_kind) + 1
                right_interval[ele_kind] = right_interval.get(ele_kind) - 1
            else:
                left_interval[ele_kind] = 1
                right_interval[ele_kind] = right_interval.get(ele_kind) - 1

            # Calculate the entropy in the left interval
            left_num = 0
            left_entropy = 0
            for key in left_interval:
                kind_num = left_interval.get(key)
                left_num = left_num + kind_num
                left_entropy = left_entropy + kind_num * math.log(kind_num, 2)
            left_entropy = (left_entropy / left_num - math.log(left_num, 2)) * -1

            # Calculate the entropy in the right interval, and there maybe a category has zero instance
            right_num = 0
            right_entropy = 0
            for key in right_interval:
                kind_num = right_interval.get(key)
                if kind_num != 0:
                    right_num = right_num + kind_num
                    right_entropy = right_entropy + kind_num * math.log(kind_num, 2)
            if right_num != 0:
                right_entropy = (right_entropy / right_num - math.log(right_num, 2)) * -1

            # Calculate the total entropy and record the value
            total_entropy = left_num * left_entropy + right_num * right_entropy
            entropy_list.append((i, total_entropy, left_entropy, right_entropy))

        # Find the split point which has the minimal entropy
        split_point = find_min_entropy_point(entropy_list)

        # Update the split_intervals, remove the old interval and add two new intervals
        for ele in split_intervals:
            # If the split point equals to the right border of the old interval, stop update
            # Because we put split point in the left interval by default, then the right interval has zero instance
            if split_point[0] in range(ele[0], ele[1] + 1) and split_point[0] != ele[1]:
                split_intervals.remove(ele)
                split_points.append(split_point[0])
                split_intervals.append((current_start_point, split_point[0] - 1, split_point[2]))
                split_intervals.append((split_point[0] + 1, current_end_point, split_point[3]))
        current_interval_num = current_interval_num + 1
    return split_points


def discretize(x_ids, rels, dis_data, state_num):
    rvs_split_points = {}
    for x_id in x_ids:
        tmp_col_names = []
        tmp_col_names.append(str(x_id))
        rel = rels[x_id]
        for y_id in rel:
            tmp_col_names.append(str(y_id))

        if len(tmp_col_names) > 1:
            # 对DataFrame进行多列访问 =》如：dis_data[['1','3']]
            tmp_data = dis_data[tmp_col_names]
            #sort_values()排序 =》by:指定列名；ascending=True:升序
            tmp_data = tmp_data.sort_values(by=tmp_col_names[0], ascending=True)
            value_kind_list = []
            # 按行循环
            for row in tmp_data.iterrows():
                # row包括[0]:原序号；[1]:数据
                row = row[1]
                kind = ""
                for k in range(1, len(row)):
                    kind = kind + str(int(row[k]))
                value_kind = (row[0], kind)
                value_kind_list.append(value_kind)
            # print(value_kind_list)
            split_points = find_split_points(value_kind_list, state_num)
            # print(split_points)
            for k in range(len(split_points)):
                split_points[k] = value_kind_list[split_points[k]][0]
            split_points.sort(key=lambda x: x)
            # print(split_points)
            key = x_id
            rvs_split_points[key] = split_points
        else:
            key = x_id
            rvs_split_points[key] = "OneKind"

    return rvs_split_points


def judge(row):
    ret = []
    for x in row:
        # abs() 函数返回数字的绝对值；np.isnan逐个元素测试是否为NaN并以布尔数组形式返回结果
        if abs(x) > 0.02 and np.isnan(x)==False:
            ret.append(1)
        else:
            ret.append(0)
    return ret


def cal_corr(data_frame):
    # DataFrame.corr：计算列的成对相关性，method指定 spearman：非线性的，非正太分析的数据的相关系数
    df = data_frame.corr(method="spearman")
    # print(df)
    # apply按行遍历df，判断每个数值：绝对值大于0.02且不为NanN置为1，否则置为0
    df = df.apply(lambda x : judge(x))
    # print(df)
    return df
