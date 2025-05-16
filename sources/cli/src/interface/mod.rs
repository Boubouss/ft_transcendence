use std::io::{stdout, Stdout, Write};

use element::{Element, ElementAction, ElementKind};
use termion::{
    clear,
    color::{self, Bg, Fg},
    cursor,
    event::Key,
    raw::{IntoRawMode, RawTerminal},
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
    Login,
}

pub struct Interface {
    stdout: RawTerminal<Stdout>,
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
            stdout: stdout().into_raw_mode().unwrap(),
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
        let mut login_button = Element::from(ElementKind::Button, String::from("Login\n"));
        let mut exit_button = Element::from(ElementKind::Button, String::from("Exit\n"));

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

    fn load_login(&mut self) {
        self.elements.clear();
        self.context = Some(Context::Login);

        let title_content = include_str!("assets/title.txt").to_string();
        let input_content = include_str!("assets/input.txt").to_string();

        let mut title = Element::from(ElementKind::Text, title_content);
        let mut username_label = Element::from(ElementKind::Text, String::from("Username:\n"));
        let mut username_input = Element::from(ElementKind::Input, input_content.clone());
        let mut password_label = Element::from(ElementKind::Text, String::from("Password:\n"));
        let mut password_input = Element::from(ElementKind::Input, input_content.clone());
        let mut login_button = Element::from(ElementKind::Button, String::from("Login\n"));
        let mut back_button = Element::from(ElementKind::Button, String::from("Go Back\n"));

        title.vertical_align(VerticalAlign::Top, &self.terminal_size, 13);
        title.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);

        username_label.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 14);
        username_label.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);

        username_input.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 13);
        username_input.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);
        username_input.set_action(ElementAction::Input);
        username_input.set_color(BACKGROUND_COLOR);
        username_input.set_background(COLOR);

        password_label.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 11);
        password_label.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);

        password_input.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 10);
        password_input.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);
        password_input.set_action(ElementAction::Input);
        password_input.set_color(BACKGROUND_COLOR);
        password_input.set_background(COLOR);

        login_button.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 6);
        login_button.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);
        login_button.set_action(ElementAction::LoadMain);
        login_button.set_color(BACKGROUND_COLOR);
        login_button.set_background(COLOR);

        back_button.vertical_align(VerticalAlign::Bottom, &self.terminal_size, 4);
        back_button.horizontal_align(HorizontalAlign::Center, &self.terminal_size, 0);
        back_button.set_action(ElementAction::LoadMain);
        back_button.set_color(BACKGROUND_COLOR);
        back_button.set_background(COLOR);

        self.elements.push(title);
        self.elements.push(username_label);
        self.elements.push(username_input);
        self.elements.push(password_label);
        self.elements.push(password_input);
        self.elements.push(login_button);
        self.elements.push(back_button);
        self.selected_index = 2;

        self.render_elements();
    }

    fn render_background(&mut self) {
        let mut i = 0;

        write!(
            self.stdout,
            "{}{}",
            cursor::Goto(1, 1),
            Bg(BACKGROUND_COLOR)
        )
        .unwrap();

        while i < self.terminal_size.width * self.terminal_size.height {
            write!(self.stdout, " ").unwrap();
            i += 1;
        }
    }

    fn render_elements(&mut self) {
        write!(self.stdout, "{}", clear::All).unwrap();

        self.render_background();

        for i in 0..self.elements.len() {
            let content = self.elements[i].get_content(i == self.selected_index);
            write!(self.stdout, "{content}").unwrap();
        }

        write!(
            self.stdout,
            "{}{}{}{}",
            style::Reset,
            Fg(color::Reset),
            Bg(color::Reset),
            cursor::Hide
        )
        .unwrap();
        self.stdout.flush().unwrap();
    }

    fn handle_action(&mut self, input: char) {
        if let Some(action) = self.elements[self.selected_index].get_action() {
            match (action, input) {
                (ElementAction::LoadMain, '\n') => self.load_main(),
                (ElementAction::LoadLogin, '\n') => self.load_login(),
                (ElementAction::Exit, '\n') => self.status = Status::Exit,
                (ElementAction::Input, c) => self.elements[self.selected_index].handle_input(c),
                (_, _) => {}
            }
        }
    }

    fn handle_down(&mut self) {
        for i in self.selected_index + 1..self.elements.len() {
            let kind = self.elements[i].get_kind();

            if *kind == ElementKind::Button || *kind == ElementKind::Input {
                self.selected_index = i;
                break;
            }
        }
    }

    fn handle_up(&mut self) {
        for i in (0..=self.selected_index - 1).rev() {
            let kind = self.elements[i].get_kind();

            if *kind == ElementKind::Button || *kind == ElementKind::Input {
                self.selected_index = i;
                break;
            }
        }
    }

    pub fn handle_input(&mut self, input: Key) {
        match input {
            Key::Ctrl('c') | Key::Ctrl('q') => self.status = Status::Exit,
            Key::Char(c) => self.handle_action(c),
            Key::Backspace => self.handle_action(127 as char),
            Key::Up => self.handle_up(),
            Key::Down => self.handle_down(),
            _ => {}
        }

        self.render_elements();
    }
}
