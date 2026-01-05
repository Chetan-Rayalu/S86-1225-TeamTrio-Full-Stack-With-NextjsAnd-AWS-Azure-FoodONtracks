import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../src/components/ui/Button';

test('renders primary button and responds to click', async () => {
  const onClick = jest.fn();
  const user = userEvent.setup();
  render(<Button label="Primary" onClick={onClick} variant="primary" />);

  const btn = screen.getByText('Primary');
  await user.click(btn);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('renders disabled button and does not call onClick', async () => {
  const onClick = jest.fn();
  const user = userEvent.setup();
  render(<Button label="Disabled" onClick={onClick} disabled />);

  const btn = screen.getByText('Disabled');
  await user.click(btn);
  expect(onClick).toHaveBeenCalledTimes(0);
});
