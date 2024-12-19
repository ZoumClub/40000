"use client";

import { supabase } from "@/lib/supabase/client";
import type { LoginFormData } from "@/lib/validations/auth";

export async function signInAdmin({ email, password }: LoginFormData) {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Verify admin role
    const { data: { role } } = await supabase.rpc('get_user_role');
    if (role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Unauthorized access');
    }

    return { success: true, user };
  } catch (error) {
    console.error('Admin sign in error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to sign in')
    };
  }
}

export async function signOutAdmin() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Admin sign out error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to sign out')
    };
  }
}

export async function verifyAdminSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false };

    const { data: { role } } = await supabase.rpc('get_user_role');
    return { success: role === 'admin' };
  } catch (error) {
    console.error('Session verification error:', error);
    return { success: false };
  }
}