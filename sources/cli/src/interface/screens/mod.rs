pub mod home;
pub mod login;

#[derive(Clone, Copy)]
pub enum Screen {
    Home,
    Login,
}
