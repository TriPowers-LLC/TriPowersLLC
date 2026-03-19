import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.update(
  '87bbc5b5-d99c-43ab-809b-11bc1bcf4b07',
  {
    endpoint: 'https://www.tripowersllc.com/contact',
    events: ['email.sent', 'email.delivered'],
    status: 'enabled',
  },
);


const { getData, getError } = await resend.webhooks.get(
  '87bbc5b5-d99c-43ab-809b-11bc1bcf4b07',
);