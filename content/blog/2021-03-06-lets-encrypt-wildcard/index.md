---
title: Let's Encrypt 와일드카드 인증서 발급받기
date: '2021-03-06'
description: Docker를 활용해 Let's Encrypt에서 와일드카드 인증서를 받아봅니다
thumbnail: './letsencrypt.png'
tags: ['Web']
---

> 필자는 Namecheap에서 도메인을 발급받아 Cloudflare DNS 서비스를 이용하기 때문에 Cloudflare DNS를 기준으로 글을 작성했습니다

# 와일드카드 인증서와 일반 인증서의 차의점은?

일반 인증서의 경우 루트 도메인과 별도로 서브 도메인을 일일히 적허서 인증서를 발급받습니다.

따라서 인증서 정보를 보면 루트 도메인과 서브 도메인이 하드 코딩 되어있기에 발급받은 후에 새로운 서브 도메인에 SSL을 적용하기 위해서는 새로운 인증서를 발급받아야 합니다.

반면 와일드카드 인증서의 경우 `*.ilcm96.me` 로 인증서를 발급받기 때문에 언제든지 다른 서브 도메인에 SSL을 적용할 수 있습니다.

# Cloudflare API키 파일 생성하기

[Cloudflare 페이지](https://dash.cloudflare.com/profile/api-tokens)에서 Global API Key를 확인합니다.

그리고 `~/.secrets/certbot/cloudflare.ini` 을 생성합니다.

```
# ~/.secrets/certbot/cloudflare.ini

dns_cloudflare_email = email@email.com
dns_cloudflare_api_key = API_KEY
```

이후 보안을 위해 권한을 설정합니다

```
chmod 600 ~/.secrets/certbot/cloudflare.ini
```

# 인증서 발급받기

## 1. certbot 이미지 실행하기

```
docker run --rm -it --name certbot \
	-v ~/docker/certbot/ilcm96.me/etc:/etc/letsencrypt \
	-v ~/docker/certbot/ilcm96.me/var:/var/lib/letsencrypt \
	-v ~/.secrets/certbot/cloudflare.ini:~/cloudflare.ini \
	certbot/dns-cloudflare \
	certonly \
	--dns-cloudflare \
	--dns-cloudflare-credentials ~/cloudflare.ini \
	-d ilcm96.me \
	-d *.ilcm96.me
```

`-v` 쪽에 있는 디렉토리와 `-d` 에 있는 도메인만 수정하면 됩니다.

## 2. 이메일 주소 입력

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Enter email address (used for urgent renewal and security notices)
(Enter 'c' to cancel):
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

여기서 적은 이메일로 인증서 만료까지 남은 일수를 알려주는 메일이 옵니다.

## 3. 약관 동의

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf.
You must agree in order to register with the ACME. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o:
```

인증서 발급에 대한 약관 동의 여부입니다.
동의를 해야 인증서 발급이 진행됩니다.

## 4. 이메일 수신 동의

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing, once your first certificate is successfully
issued, to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the
non-profit organization that develops Certbot? We'd like to send
you email about our work encrypting the web, EFF news, campaigns,
and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o:
```

`about our work encrypting the web, EFF news, campaigns, and ways to support digital freedom` 에 해당하는 이메일 수신에 대한 동의입니다.

동의하지 않아도 인증서 발급은 가능하기 때문에 거부했습니다.

## 5. 발급

```
Account registered.
Requesting a certificate for domain.TLD *.domain.TLD
Performing the following challenges:
dns-01 challenge for domain.TLD
dns-01 challenge for domain.TLD
Waiting 10 seconds for DNS changes to propagate
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/ilcm96.me/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/ilcm96.me/privkey.pem
   Your certificate will expire on 2021-05-30. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again. To non-interactively renew *all* of your
   certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

이렇게하면 발급이 완료됩니다.

인증서는 `/etc/letsencrypt` 를 마운트한 디렉토리 아래에 `/archive/domain.TLD` 에 위치합니다.

# 인증서 갱신

인증서 갱신은 발급시 입력했던 정보가 저장되어 있기때문에 간단합니다.

```
docker run --rm -it --name certbot \
	-v ~/docker/certbot/ilcm96.me/etc:/etc/letsencrypt \
	-v ~/docker/certbot/ilcm96.me/var:/var/lib/letsencrypt \
	-v ~/.secrets/certbot/cloudflare.ini:~/cloudflare.ini \
	certbot/dns-cloudflare \
	certbot renew
```
