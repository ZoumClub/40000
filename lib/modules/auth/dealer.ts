"use client";

import { supabase } from "@/lib/supabase/client";

export async function signInDealer(name: string, pin: string) {
  try {
    const { data, error } = await supabase.rpc('authenticate_dealer', {
      dealer_name: name,
      pin: pin
    });

    if (error) throw error;
    if (!data) throw new Error('Authentication failed');

    return { success: true, dealer: data };
  } catch (error) {
    console.error('Dealer sign in error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to sign in')
    };
  }
}

export async function signOutDealer() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Dealer sign out error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to sign out')
    };
  }
}

export async function verifyDealerSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false };

    const { data: { role } } = await supabase.rpc('get_user_role');
    return { success: role === 'dealer' };
  } catch (error) {
    console.error('Session verification error:', error);
    return { success: false };
  }
}