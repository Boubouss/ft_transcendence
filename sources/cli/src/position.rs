#[derive(PartialEq, Eq)]
pub enum VerticalAlign {
    Top,
    Center,
    Bottom,
}

#[derive(PartialEq, Eq)]
pub enum HorizontalAlign {
    Left,
    Center,
    Right,
}

pub struct Position {
    pub x: u16,
    pub y: u16,
}
