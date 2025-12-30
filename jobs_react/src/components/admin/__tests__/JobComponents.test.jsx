import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import JobsTable from '../JobsTable';
import JobEditor from '../JobEditor';

describe('Job components', () => {
  test('JobEditor creates a job', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<JobEditor onSave={handleSave} />);

    await user.type(screen.getByLabelText(/title/i), 'Engineer');
    await user.type(screen.getByLabelText(/location/i), 'Remote');
    await user.type(screen.getByLabelText(/description/i), 'Build things');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Engineer',
        location: 'Remote',
        description: 'Build things',
      })
    );
  });

  test('JobEditor updates a job', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    const job = { id: 1, title: 'Dev', location: 'NY', description: 'Old' };

    render(<JobEditor job={job} onSave={handleSave} />);

    await user.clear(screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Lead Dev');
    await user.click(screen.getByRole('button', { name: /update/i }));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: 'Lead Dev',
      })
    );
  });

  test('JobsTable delete flow', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    const jobs = [{ id: 7, title: 'QA', location: 'Austin' }];

    render(<JobsTable jobs={jobs} onDelete={handleDelete} />);

    await user.click(screen.getByLabelText(/delete qa/i));

    expect(handleDelete).toHaveBeenCalledWith(7);
  });
});
