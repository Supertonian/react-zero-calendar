import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { observer } from 'mobx-react-lite';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
import { getLunar } from 'holiday-kr';
import { Hidden } from '@material-ui/core';
import axios from 'axios';
import { DateTime } from 'luxon';
import datetime from '../utils/datetime';
import { CreateDialog } from './createDialog';
import { ViewDialog } from './viewDialog';
import { getHoliday } from '../utils/apicall';

const GOOGLE_API_KEY = 'AIzaSyCWLalUqC46xX50wv6oBZiDUjWN4nJnAoE';
const SELECT_LONG_PRESS_DELAY = 1000; // miliseconds

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchStartTime = 0;

const CalendarComponent = ({
  setter,
  calendarRef,
  locale,
  lunar,
  holiday,
  minDurationMinutes,
  focusDate,
  events,
  addEvent,
  changeEvent,
  deleteEvent,
  editEvent,
  categoryList,
}) => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [defaultSettings, setDefaultSettings] = React.useState({});
  const [event, setEvent] = React.useState({});
  const [holidayList, setHolidayList] = React.useState([]);

  const handleGesture = React.useCallback(() => {
    if (calendarRef.current) {
      const touchedTime = touchStartTime.diffNow();
      if (-touchedTime.milliseconds < SELECT_LONG_PRESS_DELAY) {
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);
        if (touchEndX <= touchStartX && deltaX > deltaY * 2) {
          calendarRef.current.getApi().next();
        }
        if (touchEndX >= touchStartX && deltaX > deltaY * 2) {
          calendarRef.current.getApi().prev();
        }
      }
    }
  }, [calendarRef]);

  const handleTouchStart = React.useCallback(e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = DateTime.local();
  }, []);

  const handleTouchEnd = React.useCallback(
    e => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    },
    [handleGesture],
  );

  useEffect(() => {
    if (calendarRef.current) {
      const height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
      calendarRef.current.getApi().setOption('height', height - 85 > 700 ? 700 : height - 85);

      document.querySelector('#calendar-layout').addEventListener('touchstart', handleTouchStart);
      document.querySelector('#calendar-layout').addEventListener('touchend', handleTouchEnd);

      return () => {
        document
          .querySelector('#calendar-layout')
          .removeEventListener('touchstart', handleTouchStart);
        document.querySelector('#calendar-layout').removeEventListener('touchend', handleTouchEnd);
      };
    }
    return null;
  }, [calendarRef, handleTouchEnd, handleTouchStart]);

  function handleEventClick(clickInfo) {
    setEvent(clickInfo.event);
    setViewDialogOpen(true);
  }

  function handleDateSelect(selectInfo) {
    const start = selectInfo.start.toISOString();
    const end = selectInfo.end.toISOString();
    const { allDay } = selectInfo;
    setDefaultSettings({ start, end, allDay });
    setCreateDialogOpen(true);
  }

  function handleDateClick(info) {
    const { allDay } = info;
    const start = DateTime.fromISO(info.dateStr);
    let end = '';
    // month
    if (info.view.type.includes('dayGrid') || allDay) {
      end = start.plus({ days: 1 });
    } else {
      end = start.plus({ minutes: minDurationMinutes });
    }
    setDefaultSettings({ start, end, allDay });
    setCreateDialogOpen(true);
  }

  function handleEventChange(changeInfo) {
    const { oldEvent, event } = changeInfo;
    changeEvent(oldEvent.id, event);
  }

  function getStartTime(startStr) {
    const time = startStr.split('T')[1];
    return time.split(':00+')[0];
  }

  function renderEventContent(eventContent) {
    const ext = eventContent.event.extendedProps;
    return (
      <>
        <span
          style={{
            width: '5px',
            flexShrink: 0,
            backgroundColor: ext.tagColor,
          }}
        />
        <EventContent className="event-content">
          <ScheduleTime>
            {ext.importance && '★ '}
            {!(eventContent.event.allDay || ext.forceAllDay)
              ? getStartTime(eventContent.event.startStr)
              : ''}
          </ScheduleTime>
          <ScheduleTitle>{eventContent.event.title}</ScheduleTitle>
        </EventContent>
      </>
    );
  }

  function renderHeaderContent(content) {
    const { text } = content;
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
            {lunar && `(${getLunar(content.date).month}/${getLunar(content.date).day})`}
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
            {lunar && `(${getLunar(content.date).day})`}
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
            {lunar && `(${getLunar(content.date).month}/${getLunar(content.date).day})`}
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
            {lunar && `(${getLunar(content.date).day})`}
          </span>
        </Hidden>
      </>
    );
  }

  function onUpdateDates(dateInfo) {
    const focusInLuxon = datetime.toLuxon(focusDate);
    const currentStart = datetime.toLuxon(dateInfo.view.currentStart);
    const currentEnd = datetime.toLuxon(dateInfo.view.currentEnd);

    // check if focusDate is inside view range
    if (!(focusInLuxon >= currentStart && focusInLuxon <= currentEnd)) {
      setter.setFocusDate(currentStart.toISODate());
    }
    const viewType = dateInfo.view.type;
    if (viewType === 'dayGridMonth') {
      const { title } = dateInfo.view;
      const [year, month] = title.split('/');
      setter.setTitle(`${year}년 ${month}월`);
    } else if (viewType === 'timeGridDay') {
      const [Y, M, D] = dateInfo.view.title.split('/');
      setter.setTitle(`${Y}년 ${M}월 ${D}일`);
    } else {
      const [start, end] = dateInfo.view.title.split(' – ');
      const [startY, startM] = start.split('/');
      const [endY, endM] = end.split('/');

      if (startY === endY) {
        if (startM === endM) {
          setter.setTitle(`${startY}년 ${startM}월`);
        } else {
          setter.setTitle(`${startY}년 ${startM}월 - ${endM}월`);
        }
      } else {
        setter.setTitle(`${startY}년 ${startM}월 - ${endY}년 ${endM}월`);
      }
    }
    getHoliday(
      'ko.south_korea%23holiday%40group.v.calendar.google.com',
      GOOGLE_API_KEY,
      `${currentStart.toISODate()}T00%3A00%3A00%2B09%3A00`,
      `${currentEnd.toISODate()}T00%3A00%3A00%2B09%3A00`,
    )
      .then(data => {
        const { items } = data;
        const holidays = [];
        items.forEach(item => {
          holidays.push({
            title: item.summary,
            start: item.start.date,
            end: item.end.date,
            allDay: true,
            color: 'red',
            display: 'block',
          });
        });
        setHolidayList(holidays);
      })
      .catch(e => {
        console.error(e);
        setHolidayList([]);
      });
  }

  function handleNavLinkDayClick(date) {
    if (calendarRef && calendarRef.current) {
      calendarRef.current.getApi().changeView('timeGrid', date);
      setter.setViewType('timeGridDay');
    }
  }

  function handleUrlImport() {
    const url = prompt('Enter iCal URL: ');
    axios.get(url).then(data => console.log(data));
  }

  function handleSelectAllow(info) {
    if (info.allDay) return true;
    let { start, end, startStr, endStr } = info;
    startStr = startStr.split('+')[0];
    endStr = endStr.split('+')[0];
    if (endStr.split('T')[1] === '00:00:00') {
      return end - start <= 1000 * 60 * 60 * 24;
    }
    return endStr.split('T')[0] === startStr.split('T')[0];
  }

  return (
    <>
      <CalendarGlobalStyle />
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          luxonPlugin,
          rrulePlugin,
          listPlugin,
        ]}
        headerToolbar={false}
        locale={locale}
        initialView="dayGridMonth"
        nowIndicator
        titleFormat="{yyyy/MM/dd}"
        buttonIcons
        firstDay={0}
        navLinks
        editable
        selectable
        selectMirror
        dayMaxEvents
        dayMaxEventRows={6}
        slotDuration={{ minutes: minDurationMinutes }}
        slotLabelInterval="01:00"
        slotEventOverlap={false}
        events={holiday ? [...holidayList, ...events.slice()] : events.slice()}
        select={handleDateSelect}
        dateClick={handleDateClick}
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
        unselectAuto
        unselectCancel=".MuiDialogContent-root"
        selectAllow={handleSelectAllow}
        dragScroll={false}
        progressiveEventRendering
        selectLongPressDelay={SELECT_LONG_PRESS_DELAY}
      />
      {createDialogOpen && (
        <CreateDialog
          defaultSettings={defaultSettings}
          addEvent={addEvent}
          setOpen={setCreateDialogOpen}
          categoryList={categoryList}
        />
      )}
      {viewDialogOpen && (
        <ViewDialog
          setOpen={setViewDialogOpen}
          event={event}
          deleteEvent={deleteEvent}
          editEvent={editEvent}
        />
      )}
    </>
  );
};

const EventContent = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 0.625rem;
  line-height: 0.94rem;
`;
const ScheduleTime = styled.span`
  display: inline-flex;
  margin-left: 2px;
  font-weight: 700;
  &:only-of-type {
    line-height: 1.125rem;
  }
`;
const ScheduleTitle = styled.span`
  margin-left: 2px;
  &:only-of-type {
    line-height: 1.125rem;
  }
`;

const CalendarGlobalStyle = createGlobalStyle`
.fc-event-main {
  display: flex;
  padding: 0;
  min-height: 1.125rem;
}
`;
const Calendar = observer(CalendarComponent);
export default Calendar;
