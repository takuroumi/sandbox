base = [1 0 0 ; 0 1 0 ; 0 0 1];
nonbasic = [1 1 ; 1 3 ; 2 1];

# z = cb' inv(base) b + (cn - nonbasic' (inv(base))' cb)' xn
# xb = inv(base) b - inv(base) nonbasic xn

# ^ で xn = 0 とおく
# xb = inv(base) b

#if(xb > 0){
    # answer = xb
# }

# 被約費用の計算
# (cn - nonbasic' (inv(base))' cb) <= 0 なら最適解
# else の場合は 
# xkを1つだけ増やしつつ、他は 0 とする
# 
