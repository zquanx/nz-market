-- 修复数据库schema - 为所有继承BaseEntity的表添加updated_at列
-- 这个脚本会为所有缺少updated_at列的表添加该列和相应的触发器

-- 检查并添加updated_at列到categories表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'updated_at') THEN
        ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to categories table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in categories table';
    END IF;
END $$;

-- 检查并添加updated_at列到tags表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tags' AND column_name = 'updated_at') THEN
        ALTER TABLE tags ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to tags table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in tags table';
    END IF;
END $$;

-- 检查并添加updated_at列到item_images表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'item_images' AND column_name = 'updated_at') THEN
        ALTER TABLE item_images ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_item_images_updated_at BEFORE UPDATE ON item_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to item_images table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in item_images table';
    END IF;
END $$;

-- 检查并添加updated_at列到favorites表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'favorites' AND column_name = 'updated_at') THEN
        ALTER TABLE favorites ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_favorites_updated_at BEFORE UPDATE ON favorites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to favorites table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in favorites table';
    END IF;
END $$;

-- 检查并添加updated_at列到conversations表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'conversations' AND column_name = 'updated_at') THEN
        ALTER TABLE conversations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to conversations table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in conversations table';
    END IF;
END $$;

-- 检查并添加updated_at列到messages表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'updated_at') THEN
        ALTER TABLE messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to messages table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in messages table';
    END IF;
END $$;

-- 检查并添加updated_at列到payments表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payments' AND column_name = 'updated_at') THEN
        ALTER TABLE payments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to payments table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in payments table';
    END IF;
END $$;

-- 检查并添加updated_at列到shipments表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shipments' AND column_name = 'updated_at') THEN
        ALTER TABLE shipments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to shipments table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in shipments table';
    END IF;
END $$;

-- 检查并添加updated_at列到reviews表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reviews' AND column_name = 'updated_at') THEN
        ALTER TABLE reviews ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to reviews table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in reviews table';
    END IF;
END $$;

-- 检查并添加updated_at列到email_verification_tokens表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_verification_tokens' AND column_name = 'updated_at') THEN
        ALTER TABLE email_verification_tokens ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_email_verification_tokens_updated_at BEFORE UPDATE ON email_verification_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to email_verification_tokens table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in email_verification_tokens table';
    END IF;
END $$;

-- 检查并添加updated_at列到password_reset_tokens表
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'password_reset_tokens' AND column_name = 'updated_at') THEN
        ALTER TABLE password_reset_tokens ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        CREATE TRIGGER update_password_reset_tokens_updated_at BEFORE UPDATE ON password_reset_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Added updated_at column and trigger to password_reset_tokens table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in password_reset_tokens table';
    END IF;
END $$;

-- 显示所有表的updated_at列状态
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE column_name = 'updated_at' 
ORDER BY table_name;
