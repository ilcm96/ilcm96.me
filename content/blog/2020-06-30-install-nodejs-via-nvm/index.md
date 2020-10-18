---
title: NVM으로 Node.js 설치하기
date: '2020-06-30'
description: Node Version Manager, NVM으로 Node.js를 설치해봅니다
thumbnail: './nodejs.png'
tags: ['NodeJS']
---

> Ubuntu 20.04 LTS에서 진행합니다

Node.js를 설치하는 방법은 여러가지가 있다.
바로 apt로 설치해도 되고 저장소를 추가한 후 apt로 설치해도 된다.

굳이 NVM을 통해 Node.js를 설치하는 이유는 크게 2가지다.
첫째는 다양한 버전의 Node.js를 쉽게 설치할 수 있다. Node.js 12가 릴리즈되고 10을 지우고나서 12를 설치했다가 일부 패키지가 작동이 안되서 다시 롤백한 경험이 있는데 이때 NVM이 없었다면 꽤나 귀찮았을 것이다.
둘째는 별다른 작업 없이도 npm을 sudo 없이 사용할 수 있다. apt로 설치하는 경우 npm 관련 폴더가 관리자 권한 없이는 수정할 수 없는 곳에 만들어지기 때문이다.

## NVM 설치

1. NVM 최신 버전 확인  
   [NVM 공식 Repo](https://github.com/nvm-sh/nvm/releases)에 가서 **Latest release** 항목에 있는 버전명을 체크한다

2. NVM 설치  
   `VersionName` 부분에 아까 체크한 버전명을 넣고 실행하면 NVM이 설치된다

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/VersionName/install.sh | bash
```

## Node.js 설치

1. 아래 명령어를 통해 NVM으로 설치할 수 있는 Node.js 버전을 모두 가져온다.

```
nvm ls-remote
```

2. 원하는 Node.js를 설치한다.

```
nvm install v12.18.1
```

보통 **Latest LTS**라고 적혀있는 버전을 설치하면 된다.
