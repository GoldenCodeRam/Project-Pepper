FROM python

WORKDIR /server

RUN pip3 install requests-toolbelt
RUN pip3 install pillow

COPY . .

ENV PORT=8080

EXPOSE 8080

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "server.py"]