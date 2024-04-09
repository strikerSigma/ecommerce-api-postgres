-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "dismiss" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationsId" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_notificationsId_fkey" FOREIGN KEY ("notificationsId") REFERENCES "Notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
