import { supabase } from "$lib/supabaseclient";

export async function load() {
  const { data } = await supabase
    .from("players")
    .select("name, classical_elorating, blitz_elorating, rapid_elorating, c960_elorating")
  return {
    rows: data ?? [],
  };
}
