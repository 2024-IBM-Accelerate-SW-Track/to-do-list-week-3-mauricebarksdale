import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "07/30/2024";
  let taskCount = 0;

  for (let i = 0; i < 3; i++) {
    if (!(screen.getByText("History Test"))) {
      taskCount++;
    }
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
  }

  expect(taskCount).toBe(1);
 });

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "07/30/2024";
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const check = screen.queryByText(/History Test/i);
  const checkDate = screen.queryByText(new RegExp(dueDate, "i"));
  expect(check).not.toBeInTheDocument();
  expect(checkDate).not.toBeInTheDocument();
});

  test('test that App component doesn\'t add a task without due date', () => {
    render(<App />);
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const addButton = screen.getByRole('button', {name: /Add/i});
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.click(addButton);
    const task = screen.queryByText(/History Test/i);
    expect(task).not.toBeInTheDocument();
  });



  test('test that App component can be deleted thru checkbox', () => {
    render(<App />);
    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = "07/30/2024";
    const checkbox = screen.getByRole('checkbox');
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
    fireEvent.click(checkbox);
    const check = screen.getByText(/History Test/i);
    const checkDate = screen.getByText(new RegExp(dueDate, "i"));
    expect(check).not.toBeInTheDocument();
    expect(checkDate).not.toBeInTheDocument();
  });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  const taskElement = screen.getByText(/History Test/i).closest('.task');
  const backgroundColor = window.getComputedStyle(taskElement).backgroundColor;
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
  expect(backgroundColor).toBe('red');
 });
