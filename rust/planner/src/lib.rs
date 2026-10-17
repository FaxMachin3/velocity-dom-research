//! Keyed identity planner. IDs are unique u32 values; output is old index + 1,
//! or zero for a new key. No DOM imports, strings, or per-row JS callbacks.
#[derive(Default)]
pub struct Planner { old: Vec<u32>, next: Vec<u32>, output: Vec<u32>, keys: Vec<u32>, slots: Vec<u32> }
impl Planner {
    fn prepare(&mut self, old: usize, next: usize) -> bool {
        if old > 1_000_000 || next > 1_000_000 { return false; }
        self.old.resize(old, 0); self.next.resize(next, 0); self.output.resize(next, 0);
        let cap = (old * 2 + 1).next_power_of_two();
        self.keys.resize(cap, 0); self.slots.resize(cap, 0); true
    }
    fn run(&mut self) {
        self.slots.fill(0); let mask = self.slots.len() - 1;
        for (i, &key) in self.old.iter().enumerate() {
            let mut pos = key.wrapping_mul(2654435761) as usize & mask;
            while self.slots[pos] != 0 { pos = (pos + 1) & mask; }
            self.keys[pos] = key; self.slots[pos] = i as u32 + 1;
        }
        for (i, &key) in self.next.iter().enumerate() {
            let mut pos = key.wrapping_mul(2654435761) as usize & mask;
            while self.slots[pos] != 0 && self.keys[pos] != key { pos = (pos + 1) & mask; }
            self.output[i] = self.slots[pos];
        }
    }
}
// Raw handles/pointers are internal trusted ABI; callers must not forge or reuse freed handles.
#[no_mangle] pub extern "C" fn planner_new() -> *mut Planner { Box::into_raw(Box::new(Planner::default())) }
#[no_mangle] pub unsafe extern "C" fn planner_prepare(p: *mut Planner, a: u32, b: u32) -> u32 { (&mut *p).prepare(a as usize,b as usize) as u32 }
#[no_mangle] pub unsafe extern "C" fn planner_old(p: *mut Planner) -> *mut u32 { (&mut *p).old.as_mut_ptr() }
#[no_mangle] pub unsafe extern "C" fn planner_next(p: *mut Planner) -> *mut u32 { (&mut *p).next.as_mut_ptr() }
#[no_mangle] pub unsafe extern "C" fn planner_run(p: *mut Planner) -> *const u32 { let p=&mut *p; p.run(); p.output.as_ptr() }
#[no_mangle] pub unsafe extern "C" fn planner_free(p: *mut Planner) { drop(Box::from_raw(p)); }
#[cfg(test)] mod tests { use super::*;
 #[test] fn identity_and_new_keys() { let mut p=Planner::default();p.prepare(3,4);p.old.copy_from_slice(&[0,4294967295,7]);p.next.copy_from_slice(&[7,3,0,4294967295]);p.run();assert_eq!(p.output,vec![3,0,1,2]); }
 #[test] fn empty_and_limit() {let mut p=Planner::default();assert!(p.prepare(0,0));p.run();assert!(p.output.is_empty());assert!(!p.prepare(1000001,0));}
}
