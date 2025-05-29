pub mod home;
pub mod login;
pub mod multiplayer;

#[derive(Clone, Copy)]
pub enum Screen {
    Home,
    Login,
    Multiplayer,
}
