FROM python:3.11-alpine

WORKDIR /app

COPY . .

RUN apk update
# RUN apk upgrade
RUN xargs -a requirements.txt apk add
RUN pip install -r pyrequirements.txt
RUN mkdir mnt-nfs
RUN chmod a+x startup.sh

CMD ["./startup.sh"]
