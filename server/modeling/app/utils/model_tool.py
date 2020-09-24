import numpy as np


# Data structure to hold samples and dimension state info.
# 存放样本数据
class data_blob:
    def __init__(self, _data):
        # 变量数量
        self.var_number = np.size(_data[0, :])
        # 样本数据数量
        self.n_samples = np.size(_data[:, 0])
        # 样本数据
        self.data = _data
        # 每个变量的可能取值状态，每个变量的状态数
        (self.var_range, self.var_range_length) = get_dim_range(_data, np.arange(0, self.var_number).reshape(1, self.var_number))


# Given a target, find every instance index in array
def find(arr, target):
    array = np.array([], dtype='int64')
    for i in range(np.size(arr)):
        if arr[i] == target:
            array = np.append(array, i)
    return array


# Ln gamma function ln((x-1)!) ->  ln(0) + ln(1) + ... + ln(x-1)
def ln_gamma(x):
    return sum(np.log(range(1, int(x))))


# Construct a data structure that stores the possible states (col) for each variable (row)
# Also returns a range vector that stores the number of states for each variable
def get_dim_range(_data, vec):
    count_n = 0
    d = np.size(vec[0, :])
    dim_length = np.zeros((1, d), dtype='int64')
    t = -1
    # Count number of states
    for q in range(d):
        temp_vec = np.unique(_data[:, vec[:, q]])
        x = temp_vec.reshape(1, np.size(temp_vec))
        temp_vec = x
        if temp_vec[:, 0] == -1:
            temp_vec = np.empty()
        range_n = np.size(temp_vec)
        dim_length[0, q] = range_n
        t += 1
        # Assign zeros to the end to create valid matrix dimensions.
        if count_n == 0:
            count_n = range_n
            dim = np.zeros((d, count_n), dtype='int64')
            dim[t, :] = temp_vec
        elif count_n >= range_n:
            dim[t, :] = np.concatenate((temp_vec, np.zeros((1, count_n - range_n))), axis=1)
        elif count_n < range_n:
            dim = np.concatenate((dim, np.zeros((d, range_n - count_n))))
            dim[t, :] = temp_vec
    return dim, dim_length


def score(blob, var, var_parents):
    score = 0
    n = blob.n_samples  # 数据数量
    dim_var = blob.var_range_length[0, var]  # 变量状态数
    range_var = blob.var_range[var, :]  # 变量状态取值
    r_i = dim_var
    data_o = blob.data  # 数据
    used = np.zeros(n, dtype='int64')  # 数据使用标记
    d = 1
    # Get first unproccessed sample
    while d <= n:
        freq = np.zeros(int(dim_var), dtype='int64')
        while d <= n and used[d - 1] == 1:
            d += 1
        if d > n:
            break
        # 获取待处理数据在var变量上的状态值
        for i in range(int(dim_var)):
            if range_var[i] == data_o[d - 1, var]:
                break
        # 对应状态值数量变为1，标记已经处理过的数据，找出此条数据中父节点的值，以此父节点的值，作为查找后续数据标准
        freq[i] = 1
        used[d - 1] = 1
        parent = data_o[d - 1, var_parents]
        d += 1
        if d > n:
            break
        # count frequencies of states while keeping track of used samples
        for j in range(d - 1, n):
            if used[j] == 0:
                # 找出其余未访问数据中父节点值，与之前找出的父节点值相同的数据
                if (parent == data_o[j, var_parents]).all():
                    i = 0
                    # 找出数据中var变量对应的状态值
                    while range_var[i] != data_o[j, var]:
                        i += 1
                    freq[i] += 1
                    used[j] = 1
        sum_m = np.sum(freq)
        r_i = int(r_i)
        # Finally, sum over frequencies to get log likelihood bayesian score
        # with uniform priors
        for j in range(1, r_i + 1):
            if freq[j - 1] != 0:
                score += ln_gamma(freq[j - 1] + 1)
        score += ln_gamma(r_i) - ln_gamma(sum_m + r_i)
    return score


# k2 uses scoring function to iteratively find best dag given a topological ordering
def k2(blob, order, constraint_u):
    dim = blob.var_number  # 变量数量
    dag = np.zeros((dim, dim), dtype='int64')  # 存放有向无环图结构
    k2_score = np.zeros((1, dim), dtype='float')  # 存放K2评分
    # 从拓扑排序中的第二个变量开始，每个变量的父节点只可能是排序在前面的节点
    for i in range(1, dim):
        parent = np.zeros((dim, 1))
        ok = 1
        p_old = -1e10  # 计算出上一个父节点时的评分
        while ok == 1 and np.sum(parent) <= constraint_u:
            local_max = -10e10  # 计算出所有可能父节点后的最高评分
            local_node = 0
            # iterate through possible parent connections to determine best action
            # 一次循环计算一个可能节点为父节点的评分，此时携带已经算出的父节点一起计算评分
            for j in range(i - 1, -1, -1):
                if parent[order[j]] == 0:
                    parent[order[j]] = 1
                    # score this node
                    local_score = score(blob, order[i], find(parent[:, 0], 1))
                    # determine local max
                    if local_score > local_max:
                        local_max = local_score
                        local_node = order[j]
                    # mark parent processed
                    parent[order[j]] = 0
            # assign the highest parent
            # 本次计算得出的最高评分，必须比上一次确定父节点时计算出的评分高才能作为新的父节点
            p_new = local_max
            if p_new > p_old:
                p_old = p_new
                parent[local_node] = 1
            else:
                ok = 0
        k2_score[0, order[i]] = p_old
        # print(dag)
        dag[:, order[i]] = parent.reshape(blob.var_number)
    # print(dag)
    # print(k2_score)
    return dag, k2_score


def get_dag(data):
    # print(categories)
    # print(data)

    # initialize "the blob" and map its variable names to indicies
    g = data_blob(data)
    # print(g.var_number)
    # print(g.n_samples)
    # print(g.data)
    # print(g.var_range)
    # print(g.var_range_length)

    # set the maximum number of parents any node can have
    iters = 1
    p_lim_max = 5
    # iterate from p_lim_floor to p_lim_max with random restart
    p_lim_floor = 4
    best_score = -10e10
    best_dag = np.zeros((1, 1))
    for i in range(iters):
        for u in range(p_lim_floor, p_lim_max):
            # generate random ordering

            order = np.arange(g.var_number)

            # order = np.arange(g.var_number - 3)
            # np.random.shuffle(order)
            # for j in range(3):
            #     order = np.append(order, g.var_number - 3 + j)

            # order = np.array([0, 3, 4, 5, 6, 2, 7, 8, 9, 10, 11, 1, 12, 13, 14])

            (dag, k2_score) = k2(g, order, u)
            score = np.sum(k2_score)
            # print(str(i) + ":")
            # print(order)
            # print(dag)
            # print(score)
            if score > best_score:
                best_score = score
                best_dag = dag

    # filename = 'graph_out/titanic.gph'
    # graph_out(dag, filename, mapping)
    # print(best_score)
    # print(best_dag)
    return best_dag, best_score


def find_parent(point):
    parent = []
    for i in range(len(point)):
        if point[i] == 1:
            parent.append(i)
    return parent


def get_probability(dag, categories, data):
    probability_table = {}

    dag = np.transpose(dag)
    for i in range(len(dag)):
        point = dag[i]
        if np.all(point == 0):
            freq = {}
            for sin_data in data:
                state = str(sin_data[i])
                if state in freq:
                    freq[state] += 1
                else:
                    freq[state] = 1
            sum = len(data)
            for key in freq:
                freq[key] = round(freq[key] / sum, 3)
            probability_table[categories[i]] = freq
        else:
            freq = {}
            parent = find_parent(point)
            for sin_data in data:
                parent_state = "".join([str(x) for x in sin_data[parent]])
                var_state = str(sin_data[i])
                if parent_state not in freq:
                    freq[parent_state] = dict()
                if var_state in freq[parent_state]:
                    freq[parent_state][var_state] += 1
                else:
                    freq[parent_state][var_state] = 1
            for parent_key in freq:
                var_freq = freq[parent_key]
                var_sum = np.sum(list(var_freq.values()))
                for var_key in var_freq:
                    var_freq[var_key] = round(var_freq[var_key] / var_sum, 3)
            probability_table[categories[i]] = freq
    return probability_table
