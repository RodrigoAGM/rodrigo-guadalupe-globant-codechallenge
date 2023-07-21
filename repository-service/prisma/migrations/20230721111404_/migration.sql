-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
