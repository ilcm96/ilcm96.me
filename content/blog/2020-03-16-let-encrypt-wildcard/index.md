---
title: Let's Encrypt 와일드카드 인증서 발급받기
date: '2020-03-16'
description: Docker를 활용해 Let's Encrypt에서 와일드카드 인증서를 받아봅니다
thumbnail: './letsencrypt.png'
tags: ['Web']
---

# 와일드카드 인증서와 일반 인증서와의 차이점은?

일반 인증서의 경우 발급받을때 `ilcm96.me`와 별도로 `blog.ilcm96.me` 처럼 서브 도메인을 같이 적어서 발급 받는다.  
따라서 인증서 정보를 보면 `주체 대체 이름` 항목에 해당 서브 도메인이 하드코딩 되어있기 때문에 나중에 `img.ilcm96.me`에도 SSL을 적용하고 싶다면 해당 서브 도메인을 추가해서 재발급 받아야 한다.  
와일드카드 인증서는 어떨까?  
일반 인증서와 달리 `주체 대체 이름` 항목을 보면

```
DNS Name=*.ilcm96.me
DNS Name=ilcm96.me
```

와 같이 적혀있다.  
서브 도메인이 하드코딩 되어있는것이 아니라 `*`로 적혀있기 때문에 서브 도메인에 SSL을 적용할때 일반 SSL과 달리 추가적인 작업 없이 바로 적용이 가능하다.

# 와일드카드 인증서 발급받기

직접 `certbot` 패키지를 설치해서 발급 받아도 되지만, 필자의 경우 `certbot` 패키지를 설치할 수 없는 환경이기에 Docker를 이용했다.

## 1. docker run 실행

```
docker run -it --name certbot \
    -v '/volume1/docker/ssl/wildcard_ilcm96.me/etc:/etc/letsencrypt' \
    -v '/volume1/docker/ssl/wildcard_ilcm96.me/var:/var/lib/letsencrypt' \
    certbot/certbot \
    certonly -d ilcm96.me -d *.ilcm96.me --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```

수정할 곳은 총 3군데이다.

1. `-v '/volume1/docker/ssl/wildcard_ilcm96.tk/etc:/etc/letsencrypt' \`  
   `/volume1/docker/ssl/wildcard_ilcm96.me/etc`를 원하는 경로로 바꿔준다.  
   필자처럼 NAS에서 실행하지 않는 이상 `/etc/letsencrypt`로 설정하는 것이 일반적이다.
2. `-v '/volume1/docker/ssl/wildcard_ilcm96.me/var:/var/lib/letsencrypt' \`  
   `/volume1/docker/ssl/wildcard_ilcm96.me/var`를 원하는 경로로 바꿔준다.  
   위와 마찬가지로 특별한 이유가 없다면 `/var/lib/letsencrypt`로 설정하는 것이 일반적이다.
3. `-d ilcm96.me -d *.ilcm96.me`
   자신의 도메인을 적으면 된다.  
   와일드카드 인증서를 받기 위해서는 앞에 `*.`을 붙여야한다.

Enter를 누르면 아래와 같은 줄이 지나가면서 `certbot` 이미지를 다운로드 받는다.

```
Unable to find image 'certbot/certbot:latest' locally
latest: Pulling from certbot/certbot
050382585609: Already exists
39e8b6a82737: Pull complete
9c3480ede676: Pull complete
7a50c76dc4da: Pull complete
f19dd207bd1d: Pull complete
e04f1d95d36c: Pull complete
63ff27aad4df: Pull complete
9fc3c4bc5d28: Pull complete
a0e7be3caaa3: Pull complete
Digest: sha256:b8f15cf4904dc24e63542689b6aa3bf942174f4ae9d31020caa4114e8d97d8ef
Status: Downloaded newer image for certbot/certbot:latest
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
```

## 2. 이메일 주소 입력

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Enter email address (used for urgent renewal and security notices) (Enter 'c'
to cancel):
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

자신이 사용하는 이메일을 적으면 된다.

## 3. 약관 동의

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(A)gree/(C)ancel:
```

인증서 발급에 대한 약관 동의이다.  
동의를 해야 인증서 발급이 진행된다.

## 4. 이메일 수신 동의

```
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? We'd like to send you email about our work
encrypting the web, EFF news, campaigns, and ways to support digital freedom.

(Y)es/(N)o:
```

`about our work encrypting the web, EFF news, campaigns, and ways to support digital freedom`에 해당하는 이메일 수신에 대한 동의이다.  
동의하지 않아도 인증서 발급은 가능하기 때문에 필자는 거부했다.

## 5. IP 주소 기록

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o:
```

IP 주소가 공개적으로 기록되니 유의하라는 문구이다.  
동의하지 않으면 발급이 중단된다.

## 6. 도메인 검증

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name
_acme-challenge.ilcm96.tk with the following value:

8rMAHXGbgXF-v9B8fDq8i3ucOF5xhLjPV4peoWH-l0I

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
```

`docker run`에서 입력했던 도메인이 본인 소유인지 확인하는 단계이다.  
네임서버를 관리하는 곳에 가서 `8rMAHXG...` 자리에 있는 토큰을 `_acme-challenge.ilcm96.me` `TXT` 레코드로 추가하면 된다.  
TTL 이상의 시간이 지나고 Enter를 누르면 똑같은 메세지가 토큰만 바뀌어서 나오는데 위에서 입력한 **레코드를 지우지 말고** 바뀐 토큰을 넣어서 레코드를 추가하면 된다.

![](./txt-record.png)

인증할 수 있는 횟수가 정해져 있으므로 잘 추가되었나 확인하고 진행해야 한다.

## 7. 인증서 확인

```
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/ilcm96.me/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/ilcm96.me/privkey.pem
   Your cert will expire on 2019-11-11. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

위와 같은 문구가 나오며 컨테이너가 종료된다면 정상적으로 발급된 것이다.  
인증서는 자신이 `/etc/letsencrypt`에 마운트 시킨폴더 아래에 `live`나 `archive` 폴더에 있으므로 자신의 서버에 적용하면 된다.

# 마치며...

요즘 웹서버의 기본중 하나인 SSL 적용을 위한 와일드카드 인증서 발급에 대해서 알아봤다.  
SEO를 떠나 보안을 위한 정말 기본적인 부분이기 때문에 만약 운용중인 웹서버에 SSL이 적용되어 있지 않다면 하는 것을 강력히 추천한다.

---

[전체 로그](https://gist.github.com/ilcm96/ab24c3af95af94337df1fe14174ed870)
