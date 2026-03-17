CREATE DATABASE usuario;

USE usuario;

CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

