import React, { useEffect } from 'react';
import { observable } from 'mobx';
import { persist } from 'mobx-persist';
import { observer } from 'mobx-react-lite';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
import { getLunar } from 'holiday-kr';
import datetime from '../utils/datetime';
import Button from '@material-ui/core/Button';
import { Hidden } from '@material-ui/core';
import { CreateDialog } from './createDialog';

const data = observable({
  maxId: 0,
  events: [],
});

const schema = {
  maxId: true,
  events: {
    type: 'list',
    schema: {
      id: true,
      title: true,
      start: true,
      end: true,
      allDay: true,
      display: true,
    },
  },
};

const state = persist(schema)(data);
export const zerostrengthCalendar = state;

// actions
function addEvent(event) {
  state.events.push({ ...event, ...{ id: state.maxId } });
  state.maxId += 1;
}

// end of actions

const CalendarComponent = ({ setter, calendarRef, locale, lunar }) => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [defaultSettings, setDefaultSettings] = React.useState({});
  useEffect(() => {
    setter.setTitle(calendarRef.current.getApi().view.title);
    const height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
    calendarRef.current.getApi().setOption('height', height - 85 > 700 ? 700 : height - 85);
  }, [calendarRef, setter]);

  function handleEventClick(clickInfo) {
    console.log(clickInfo.event.start);
    console.log(clickInfo.event.end);
    console.log(clickInfo.event.title);
  }

  function handleDateSelect(selectInfo) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    const start = selectInfo.start.toISOString();
    const end = selectInfo.end.toISOString();
    setDefaultSettings({ start, end });
    setCreateDialogOpen(true);
  }

  function handleEventChange(changeInfo) {
    changeInfo.revert();
  }

  function renderEventContent(eventContent) {}

  function renderHeaderContent(content) {
    let { text } = content;
    const color = content.dow === 0 ? 'red' : 'black';

    if (content.view.type === 'dayGrid' || content.view.type === 'dayGridMonth') {
      return (
        <>
          <span style={{ color }}>{datetime.getDayName(content.dow, locale)}</span>
        </>
      );
    }
    return (
      <>
        <span style={{ color }}>{text}</span>
        <Hidden xsDown>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).month}/${getLunar(content.date).day})`}
          </span>
        </Hidden>
        <Hidden smUp>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).day})`}
          </span>
        </Hidden>
      </>
    );
  }

  function renderDayContent(content) {
    const color = content.dow === 0 ? 'red' : 'black';

    if (content.view.type === 'timeGridWeek' || content.view.type === 'timeGridDay') {
      return <></>;
    }
    return (
      <>
        <span style={{ color }}>{content.date.getDate()}</span>
        <Hidden xsDown>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).month}/${getLunar(content.date).day})`}
          </span>
        </Hidden>
        <Hidden smUp>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).day})`}
          </span>
        </Hidden>
      </>
    );
  }

  function onUpdateDates() {
    if (calendarRef && calendarRef.current) {
      setter.setTitle(calendarRef.current.getApi().view.title);
    }
  }

  function handleNavLinkDayClick(date) {
    if (calendarRef && calendarRef.current) {
      calendarRef.current.getApi().changeView('timeGrid', date);
      setter.setViewType('timeGridDay');
    }
  }

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, luxonPlugin, rrulePlugin]}
        headerToolbar={false}
        locale={locale}
        initialView="dayGridMonth"
        nowIndicator
        titleFormat="yyyy년 {MM}월"
        buttonIcons
        firstDay={0}
        navLinks
        editable
        selectable
        selectMirror
        dayMaxEvents
        dayMaxEventRows={6}
        slotDuration="00:30:00"
        slotLabelInterval="01:00"
        events={state.events.slice()}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        fixedWeekCount={false}
        datesSet={onUpdateDates}
        allDayText="종일"
        moreLinkText=""
        dayHeaderContent={renderHeaderContent}
        dayCellContent={renderDayContent}
        allDayMaintainDuration
        navLinkDayClick={handleNavLinkDayClick}
      />
      <Button onClick={() => { setDefaultSettings({}); setCreateDialogOpen(true); }}>새 일정</Button>
      <CreateDialog defaultSettings={defaultSettings} addEvent={addEvent} open={createDialogOpen} setOpen={setCreateDialogOpen} />
    </>
  );
};

export const Calendar = observer(CalendarComponent);
