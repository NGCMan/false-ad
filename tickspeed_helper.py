inc = (3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40)

start = (1, 2, 4, 6, 9, 13, 18, 24, 32, 41, 54, 68)

def buy(t, i):
    return tuple(j + k if j == t[i] else j for j, k in zip(t, inc))

def path(t, n):
    if all(i > n for i in t):
        yield ()
    elif len(set(t)) == len(t):
        for i in sorted(range(len(t)), key=lambda i: (t[i], -i)):
            for j in path(buy(t, i), n):
                yield (i,) + j

def buy_all(t, l):
    for i in l:
        t = buy(t, i)
    return t

def main():
    t = buy_all(start, (0, 1, 2, 3, 4))
    sol = next(path(t, 308))
    for i in sol:
        print(t)
        print('123456789abc'[i])
        t = buy(t, i)
    print(t)

main()
