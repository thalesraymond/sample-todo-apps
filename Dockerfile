FROM mongo:8.0

VOLUME /data/db

EXPOSE 27017

CMD ["mongod"]
