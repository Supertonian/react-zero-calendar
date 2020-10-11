import { observable } from 'mobx';
import { persist } from 'mobx-persist';

const store = observable({
  filterCheck: { lunar: true, holiday: true },
});

const schema = {
  filterCheck: {
    type: 'object',
    schema: {
      lunar: true,
      holiday: true,
    },
  },
};

const calendarStore = persist(schema)(store);
export default calendarStore;
