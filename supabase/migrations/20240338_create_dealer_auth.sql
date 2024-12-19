-- Function to create dealer auth user
CREATE OR REPLACE FUNCTION create_dealer_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create auth user with dealer email
    INSERT INTO auth.users (
        instance_id,
        id,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        NEW.id,
        'authenticated',
        NEW.email,
        crypt(NEW.pin, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create auth user when dealer is created
CREATE TRIGGER on_dealer_created
    AFTER INSERT ON dealers
    FOR EACH ROW
    EXECUTE FUNCTION create_dealer_auth_user();

-- Function to handle dealer login
CREATE OR REPLACE FUNCTION dealer_login(dealer_name TEXT, pin TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    token TEXT
) AS $$
DECLARE
    v_dealer_id UUID;
    v_token TEXT;
BEGIN
    -- Get dealer ID by first name and PIN
    SELECT d.id INTO v_dealer_id
    FROM dealers d
    WHERE LOWER(SPLIT_PART(d.name, ' ', 1)) = LOWER(dealer_name)
    AND d.pin = pin;

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;

    -- Generate JWT token
    SELECT auth.sign(
        json_build_object(
            'role', 'authenticated',
            'user_id', v_dealer_id,
            'exp', extract(epoch from (now() + interval '1 day'))::integer
        ),
        current_setting('app.jwt_secret')
    ) INTO v_token;

    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        v_token as token
    FROM dealers d
    WHERE d.id = v_dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;