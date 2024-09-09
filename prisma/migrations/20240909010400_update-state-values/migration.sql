-- Update new state columns based on the old State id references
UPDATE "Game"
SET "state" = CASE
    WHEN "stateId" = 'Achievements' THEN 'ACHIEVEMENTS'::"GameState"
    WHEN "stateId" = 'Banned' THEN 'BANNED'::"GameState"
    WHEN "stateId" = 'Completed' THEN 'COMPLETED'::"GameState"
    WHEN "stateId" = 'Dropped' THEN 'DROPPED'::"GameState"
    WHEN "stateId" = 'Playing' THEN 'PLAYING'::"GameState"
    WHEN "stateId" = 'Won' THEN 'WON'::"GameState"
END;

UPDATE "ChangeLog"
SET "state" = CASE
    WHEN "stateId" = 'Achievements' THEN 'ACHIEVEMENTS'::"GameState"
    WHEN "stateId" = 'Banned' THEN 'BANNED'::"GameState"
    WHEN "stateId" = 'Completed' THEN 'COMPLETED'::"GameState"
    WHEN "stateId" = 'Dropped' THEN 'DROPPED'::"GameState"
    WHEN "stateId" = 'Playing' THEN 'PLAYING'::"GameState"
    WHEN "stateId" = 'Won' THEN 'WON'::"GameState"
END;

-- Drop the old stateId columns
ALTER TABLE "ChangeLog" DROP COLUMN "stateId";
ALTER TABLE "Game" DROP COLUMN "stateId";