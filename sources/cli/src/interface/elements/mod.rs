use crate::position::Position;
use button::Button;
use error::Error;
use input::Input;
use text::Text;

pub mod button;
pub mod error;
pub mod input;
pub mod text;

pub enum Elements {
    Text(Text),
    Button(Button),
    Input(Input),
    Error(Error),
}

pub trait Element {
    fn new(position: Position, content: String) -> Self;
}
