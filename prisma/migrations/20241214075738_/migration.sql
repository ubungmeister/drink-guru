-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cocktail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Cocktail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCocktail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cocktailId" TEXT NOT NULL,

    CONSTRAINT "UserCocktail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CocktailMetric" (
    "cocktailId" TEXT NOT NULL,
    "sweetness" DOUBLE PRECISION,
    "sourness" DOUBLE PRECISION,
    "alcoholStrength" DOUBLE PRECISION,
    "bitterness" DOUBLE PRECISION,
    "timeToMake" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CocktailMetric_pkey" PRIMARY KEY ("cocktailId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cocktail_name_key" ON "Cocktail"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserCocktail_userId_cocktailId_key" ON "UserCocktail"("userId", "cocktailId");

-- AddForeignKey
ALTER TABLE "UserCocktail" ADD CONSTRAINT "UserCocktail_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCocktail" ADD CONSTRAINT "UserCocktail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CocktailMetric" ADD CONSTRAINT "CocktailMetric_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
