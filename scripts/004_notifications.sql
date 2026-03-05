-- ============================================================
-- إنشاء جدول الإشعارات
-- نفّذ هذا في Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type        text NOT NULL CHECK (type IN ('application_update', 'new_application', 'new_job')),
  title       text NOT NULL,
  description text NOT NULL,
  read        boolean DEFAULT false,
  link        text,
  created_at  timestamptz DEFAULT now()
);

-- فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(user_id, read);

-- تفعيل RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- كل مستخدم يرى إشعاراته فقط
CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Triggers use SECURITY DEFINER and bypass RLS, so this policy
-- only governs direct client inserts (restricted to own user_id).
CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: إشعار تلقائي عند تغيير حالة الطلب
-- ============================================================

CREATE OR REPLACE FUNCTION notify_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_job_title     text;
  v_company_name  text;
  v_title         text;
  v_description   text;
BEGIN
  -- جلب عنوان الوظيفة واسم الشركة
  SELECT j.title, c.company_name
  INTO v_job_title, v_company_name
  FROM jobs j
  JOIN companies c ON c.id = j.company_id
  WHERE j.id = NEW.job_id;

  -- تحديد نص الإشعار بناءً على الحالة الجديدة
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    v_title       := '🎉 تم قبول طلبك!';
    v_description := 'تم قبول طلبك على وظيفة "' || v_job_title || '" من شركة ' || v_company_name;

  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    v_title       := '❌ تم رفض طلبك';
    v_description := 'للأسف تم رفض طلبك على وظيفة "' || v_job_title || '"';

  ELSE
    RETURN NEW; -- لا إشعار للحالات الأخرى
  END IF;

  -- إدراج الإشعار
  INSERT INTO notifications (user_id, type, title, description, link)
  VALUES (
    NEW.worker_id,
    'application_update',
    v_title,
    v_description,
    '/dashboard/worker'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط الـ Trigger بجدول applications
DROP TRIGGER IF EXISTS on_application_status_change ON applications;
CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_application_status_change();

-- ============================================================
-- Trigger: إشعار للشركة عند وصول طلب جديد
-- ============================================================

CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
DECLARE
  v_job_title    text;
  v_company_owner uuid;
  v_worker_name  text;
BEGIN
  -- جلب عنوان الوظيفة وصاحب الشركة
  SELECT j.title, c.profile_id
  INTO v_job_title, v_company_owner
  FROM jobs j
  JOIN companies c ON c.id = j.company_id
  WHERE j.id = NEW.job_id;

  -- جلب اسم العامل
  SELECT full_name INTO v_worker_name
  FROM profiles WHERE id = NEW.worker_id;

  -- إشعار لصاحب الشركة
  INSERT INTO notifications (user_id, type, title, description, link)
  VALUES (
    v_company_owner,
    'new_application',
    '📩 طلب توظيف جديد!',
    'تقدّم ' || COALESCE(v_worker_name, 'عامل') || ' على وظيفة "' || v_job_title || '"',
    '/dashboard/company'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_application ON applications;
CREATE TRIGGER on_new_application
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_application();
