---
title: Ubuntu Docker 설치
date: '2020-03-09'
description: 이제는 표준이 된 Docker를 설치해 봅니다
thumbnail: './docker.png'
tags: ['Docker']
---

# 1. Docker 설치

> 아래 스크립트는 굳이 Ubuntu가 아니더라도 CentOS나 Debian에서도 동일하게 사용할 수 있다

```bash
curl -fsSL https://get.docker.com | sh
```

# 2. 사용자를 Docker 그룹에 추가

이 단계를 거치지 않으면 `sudo` 없이 `docker` 명령어를 실행하면 권한 오류가 발생한다.  
따라서 사용자를 Docker 그룹에 추가해줘야 한다.

```bash
sudo usermod -aG docker $USER
```

위 명령어는 현재 로그인한 사용자를 Docker 그룹에 추가하는 명령어인데, 만약 다른 사용자를 Docker 그룹에 추가하고 싶다면 `$USER` 부분을 해당 사용자명으로 변경하면 된다.

# 3. 설치 확인

```bash
sudo systemctl status docker

# 결과
ubuntu@general:~$ sudo systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2020-03-05 07:59:08 UTC; 8s ago
     Docs: https://docs.docker.com
 Main PID: 4273 (dockerd)
    Tasks: 10
   CGroup: /system.slice/docker.service
           └─4273 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```
