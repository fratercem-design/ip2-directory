
const { createClient } = require('@supabase/supabase-js');

async function seed() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
    });

    console.log("Creating Streamer...");
    // Upsert Streamer
    const { data: sData, error: sError } = await db
        .from("streamers")
        .upsert({
            slug: "cult-of-psyche",
            display_name: "Cult of Psyche",
            bio: "Official Channel of Psycheverse.org"
        }, { onConflict: "slug" })
        .select()
        .single();

    if (sError) {
        console.error("Streamer Error:", sError);
        return;
    }
    console.log("Streamer ID:", sData.id);

    // Upsert Account
    console.log("Creating Account...");
    const { data: aData, error: aError } = await db
        .from("platform_accounts")
        .upsert({
            streamer_id: sData.id,
            platform: "youtube",
            platform_user_id: "UCWw3dB8Fj_wsG4YFMMznqyw",
            platform_username: "CultofPsyche",
            is_enabled: true
        }, { onConflict: "platform,platform_user_id" }) // Access constraints need to check if this tuple is unique. Schema says keys are PK or Unique?
        // Actually schema doesn't have a unique constraint on (platform, user_id) explicitly maybe?
        // Let's check schema or just try insert.
        // Wait, `onConflict` requires a constraint name or column list.
        // Let's just try insert and ignore error or select first.
        .select();

    // Actually, safer to select then insert if needed.
    const { data: existing } = await db.from("platform_accounts").select("id").eq("platform", "youtube").eq("platform_user_id", "UCWw3dB8Fj_wsG4YFMMznqqyw").maybeSingle();

    if (!existing) {
        const { error } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "youtube",
            platform_user_id: "UCWw3dB8Fj_wsG4YFMMznqqyw",
            platform_username: "CultofPsyche",
            is_enabled: true
        });
        if (error) console.error("Account Error:", error);
        else console.log("Account Created.");
    } else {
        console.log("Account already exists.");
    }
}

seed();
