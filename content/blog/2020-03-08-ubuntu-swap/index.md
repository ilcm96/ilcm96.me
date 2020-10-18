---
title: Ubuntu Swap 설정
date: '2020-03-08'
description: 램이 부족한 인스턴스를 위해 Swap를 설정해봅니다
thumbnail: './ubuntu.png'
tags: ['Linux']
---

# 1. Swap 상태 확인하기

```
free -m
              total        used        free      shared  buff/cache   available
Mem:            981         521         158           1         301         359
Swap:             0           0           0
```

위와 같이 모두 0 0 0으로 나오면 Swap이 없는 상태이다.

# 2. Swapfile 생성하기

이전과 달리 18.04 LTS 부터는 Swap 파티션이 아니라 Swapfile을 통해서 Swap을 생성한다.  
파티션이 아니므로 삭제나 생성이 자유롭다.

```
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

1G = 1GB를 의미하며 원하는 용량을 입력하면 된다.

# 3. Swap 생성 후 확인하기

이렇게 Swapfile을 생성한 후 다시 `free -m` 이나 `htop` 등으로 Swap이 잘 작동하고 있나 확인하면 된다.

```
ubuntu@general:~$ free -m
              total        used        free      shared  buff/cache   available
Mem:            981         546          67           3         368         293
Swap:          1023          34         989
```

이렇게 Ubuntu에서 Swapfile을 통해 Swap을 설정해보았다.  
어느 정도의 Swap은 도움이 되지만 Swap이 너무 많이 차면 순간적인 램 사용량 증가에 대비하지 못하고 온프레스미 환경에서는 디스크의 수명도 줄어드므로 인스턴스를 업그레이드 하거나 램을 추가하는 것이 좋다.
