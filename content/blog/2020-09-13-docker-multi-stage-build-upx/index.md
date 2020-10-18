---
title: 가벼운 Golang 이미지 만들기
date: '2020-09-13'
description: Docker의 Multi Stage Build와 UPX를 통해 가벼운 Docker 이미지를 만들어봅니다
thumbnail: './docker.png'
tags: ['Docker']
---

# [distroless](https://github.com/GoogleContainerTools/distroless)나 Alpine linux은 이미 가볍지 않은가?

물론 단일 바이너리 파일로 실행 가능하기 떄문에 Python이나 nodejs보다는 가볍다.

그러나 Golang은 컴파일시 의존성이 모두 한 바이너리 파일에 포함된 채로 컴파일 된다.  
즉 굳이 OS의 구성요소가 필요하지 않기 때문에 [scratch](https://hub.docker.com/_/scratch/) 이미지를 사용해서 오직 바이너리 파일만 포함시키면 된다.

# scratch 이미지를 바로 사용할 순 없는가?

로컬에서는 Dockerfile에서 scratch 이미지에 바이너리 파일을 `COPY`하는 것이 큰 문제가 되지 않는다.  
그러나 CI 환경에서 사용할 때는 CI을 돌릴때마다 CI VM에 Golang을 설치해야 하기에 살짝 귀찮아진다.

#### Golang 설치 ➔ 바이너리 빌드 ➔ 바이너리 복사

이를 해결하기 위해서 이 글에서는 Mutli Stage Build를 활용할 것이다.

# Mutli Stage Build를 써보자

```Dockerfile
FROM  golang:1.14-buster as builder

WORKDIR /tmp/tiny-golang-image
COPY . .

RUN go mod tidy \
    && go get -u -d -v ./...
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-s -w' -o main cmd/main.go

FROM scratch
COPY --from=builder /tmp/tiny-golang-image /
CMD ["/main"]
```

위 Dockerfile이 이 글에서 만들게 될 최종적인 Dockfile이다.  
일반적인 Dockerfile과는 달리 `FROM` 구문이 2개이고 `--from`과 `as`가 새로 등장했다.  
이제 차근차근 하나씩 뜯어보자.

## 1. 컴파일 스테이지

```Dockerfile
FROM  golang:1.14-buster as builder
WORKDIR /tmp/tiny-golang-image
COPY . .

RUN go mod tidy \
    && go get -u -d -v ./...
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-s -w' -o main cmd/main.go
```

모든 Dockerfile과 마찬가지로 `FROM`과 함께 시작한다.  
이 스테이지에서는 바이너리를 컴파일(빌드)하는 스테이지이므로 끝에 `as builder`라는 말을 붙였다.  
주목해야 할 부분은 두번째 `RUN`이다.

- `CGO_ENABLED=0`, `-a`  
  `scratch` 이미지에는 C 바이너리가 존재하지 않기때문에 표준 라이브러리를 모두 다시 빌드한다.
- `-ldflags '-s -w'`  
  디버그 정보를 삭제해 바이너리 크기를 줄인다.

## 2. 두번째 스테이지

```docker
FROM scratch
COPY --from=builder /tmp/tiny-golang-image /
CMD ["/main"]
```

- `FROM scratch`  
  말 그대로 아무 것도 없는 이미지
- `COPY --from=builder /tmp/tiny-golang-image /`  
  `builder` 스테이지의 `/tmp/tiny-golang-image` 폴더를 `/`로 복사한다.
- `CMD ["/main"]`  
  `builder` 스테이지에서 바이너리의 이름을 `main`으로 했기 때문에 `main`을 실행시킨다.

이렇게 멀티 스테이지 빌드를 거치면 `Docker`의 이미지 크기를 정말 많이 줄일 수 있다.  
이제는 바이너리 크기 자체를 줄여보자.

# UPX 사용하기

## 1. UPX 다운로드

[UPX 저장소](https://github.com/upx/upx/releases)에서 linux용 중 바이너리가 돌아가는 환경이 아니라, 각자의 CI 환경에 맞춰 다운로드 받는다.

## 2. Dockerfile 수정하기

```Dockerfile{9,10}
FROM golang:1.14-buster as builder

WORKDIR /tmp/tiny-golang-image
COPY . .

RUN go mod tidy \
 && go get -u -d -v ./...
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-s -w' -o main cmd/main.go
    && chmod +x upx \
    && ./upx --lzma main

FROM scratch
COPY --from=builder /tmp/tiny-golang-image /
CMD ["/main"]

```

`builder` 스테이지에서 바이너리를 빌드하고 UPX로 패킹한다.

필자는 UPX를 사용하는 프로젝트는 UPX 바이너리를 아예 저장소에 올려놓았다.  
만약 저장소에는 해당 프로젝트에 관련된 파일만 있는 것을 원한다면 `builder` 스테이지에서 UPX를 `curl`나 `wget`으로 다운로드 받으면 된다.

# 결과

```
IMAGE                        SIZE        REDUCE RATIO
no-optimization              1.4GB
multi-stage                  21.2MB      98.5%
multi-stage-ldflags          16.3MB      24%
multi-stage-ldflags-upx      3.95MB      76%
```

최종 이미지의 크기는 `no-optimization`의 **0.3%**, `multi-stage`의 **19%**밖에 되지 않는다.
AWS ECR이나 GCP의 Container Registry에서 이미지의 크기의 감소는 곧바로 비용 감소로 이어지고 배포시간도 짧아지기에 시도해 볼 가치가 충분하다고 느껴진다.
