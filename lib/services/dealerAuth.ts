"use client";

import { supabase } from "@/lib/supabase/client";

export async function authenticateDealer(name: string, pin: string) {
  try {
    // Get first word of name for comparison
    const firstName = name.split(" ")[0].toLowerCase();

    // Get dealer by name and PIN
    const { data: dealer, error: dealerError } = await supabase
      .rpc('authenticate_dealer', {
        dealer_name: firstName,
        pin: pin
      });

    if (dealerError || !dealer) {
      throw new Error("Invalid credentials");
    }

    // Sign in with dealer's email and PIN as password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: dealer.email,
      password: pin,
    });

    if (signInError) throw signInError;

    // Update last login timestamp
    await supabase
      .from('dealers')
      .update({ last_login: new Date().toISOString() })
      .eq('id', dealer.id);

    return { success: true, dealer };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error };
  }
}

export async function signOutDealer() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
}