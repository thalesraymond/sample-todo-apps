FROM mongo:6.0

VOLUME /data/db

EXPOSE 27017

CMD ["mongod"]
