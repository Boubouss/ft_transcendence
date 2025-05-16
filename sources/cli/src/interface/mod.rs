use element::{Element, ElementAction, ElementKind};
use termion::{
    clear,
    color::{self, Bg, Fg},
    cursor,
    event::Key,
    style, terminal_size,
};

use crate::{
    position::{HorizontalAlign, VerticalAlign},
    size::Size,
    BACKGROUND_COLOR, COLOR,
};

mod element;

#[derive(PartialEq, Eq)]
pub enum Status {
    Run,
    Exit,
}

enum Context {
    Main,
}

pub struct Interface {
    context: Option<Context>,
    elements: Vec<Element>,
    selected_index: usize,
    terminal_size: Size,
    status: Status,
}

impl Interface {
    pub fn new() -> Self {
        let size = match terminal_size() {
            Ok(size) => size,
            Err(err) => panic!("Error: {err}"),
        };

        let mut interface = Self {
            context: None,
            elements: Vec::new(),
            selected_index: 0,
            terminal_size: Size {
                width: size.0,
                height: size.1,
            },
            status: Status::Run,
        };

        interface.load_main();

        interface
    }

    pub fn get_status(&self) -> &Status {
        &self.status
    }

    fn load_main(&mut self) {
        self.elements.clear();
        self.context = Some(Context::Main);

        let title_content = include_str!("assets/title.txt").to_string();

        let mut title = Element::from(ElementKind::Text, title_content);
        let mut login_button = Element::from(ElementKind::Button, String::from("Login"));
        let mut exit_button = Element::from(ElementKind::Button, String::from("Exit"));

        title.vertical_align(VerticalAlign::Top, &self.terminal_size, 13);
        title.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);

        login_button.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 13);
        login_button.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);
        login_button.set_action(ElementAction::LoadLogin);
        login_button.set_color(BACKGROUND_COLOR);
        login_button.set_background(COLOR);

        exit_button.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 11);
        exit_button.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);
        exit_button.set_action(ElementAction::Exit);
        exit_button.set_color(BACKGROUND_COLOR);
        exit_button.set_background(COLOR);

        self.elements.push(title);
        self.elements.push(login_button);
        self.elements.push(exit_button);
        self.selected_index = 1;

        self.render_elements();
    }

    fn render_background(&self) {
        let mut i = 0;

        print!("{}{}", cursor::Goto(1, 1), Bg(BACKGROUND_COLOR));

        while i < self.terminal_size.width * self.terminal_size.height {
            print!(" ");
            i += 1;
        }
    }

    fn render_elements(&self) {
        println!("{}", clear::All);

        self.render_background();

        for i in 0..self.elements.len() {
            self.elements[i].render(i == self.selected_index);
        }

        println!(
            "{}{}{}{}",
            style::Reset,
            Fg(color::Reset),
            Bg(color::Reset),
            cursor::Hide
        );
    }

    fn handle_action(&mut self) {
        if let Some(action) = self.elements[self.selected_index].get_action() {
            match action {
                ElementAction::LoadLogin => self.status = Status::Run,
                ElementAction::Exit => self.status = Status::Exit,
            }
        }
    }

    fn handle_down(&mut self) {
        for i in self.selected_index + 1..self.elements.len() {
            let kind = self.elements[i].get_kind();

            if *kind == ElementKind::Button {
                self.selected_index = i;
                self.render_elements();
                break;
            }
        }
    }

    fn handle_up(&mut self) {
        for i in (0..=self.selected_index - 1).rev() {
            let kind = self.elements[i].get_kind();

            if *kind == ElementKind::Button {
                self.selected_index = i;
                self.render_elements();
                break;
            }
        }
    }

    pub fn handle_input(&mut self, input: Key) {
        if input == Key::Ctrl('c') || input == Key::Ctrl('q') {
            self.status = Status::Exit;
        } else if input == Key::Char('\n') {
            self.handle_action();
        } else if input == Key::Up {
            self.handle_up();
        } else if input == Key::Down {
            self.handle_down();
        }
    }
}
