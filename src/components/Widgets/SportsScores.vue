<template>
<div class="sports-scores-wrapper" v-if="matches">
  <!-- Show back to original button -->
  <p v-if="whatToShow === 'team' && currentTeamId !== teamId"
  @click="fetchTeamScores(teamId)" class="back-to-original">
    ⇦ Back to Original Team
  </p>
  <p v-else-if="whatToShow === 'league' && leagueId && currentLeagueId !== leagueId"
  @click="fetchLeagueScores(leagueId)" class="back-to-original">
    ⇦ Back to Original League
  </p>
  <!-- Show toggle switch for past and future matches -->
  <div class="past-or-future">
    <span
      :class="`btn ${whenToShow === 'past' ? 'selected' : ''}`"
      v-tooltip="tooltip('View Recent Scores')"
      @click="fetchPastFutureEvents('past')"
    >
      Past Scores
    </span>
    <span
      :class="`btn ${whenToShow === 'future' ? 'selected' : ''}`"
      v-tooltip="tooltip('View Upcoming Games')"
      @click="fetchPastFutureEvents('future')"
    >
      Upcoming Games
    </span>
  </div>
  <div class="match-row" v-for="match in matches" :key="match.id">
    <!-- Banner Image -->
    <div class="match-thumbnail-wrap" v-if="!hideImage">
      <img :src="match.thumbnail" :alt="`${match.title} Banner Image`" class="match-thumbnail" />
    </div>
    <!-- Team Scores -->
    <div class="score">
      <div
        :class="`score-block home ${currentTeamId !== match.home.id ? 'clickable' : ''}`"
        v-tooltip="tooltip(`Click to view ${match.home.name} Scores`)"
        @click="fetchTeamScores(match.home.id)"
      >
        <p class="team-score">{{ match.home.score }}</p>
        <p class="team-name">{{ match.home.name }}</p>
        <p class="team-location">Home</p>
      </div>
      <div class="colon">{{ match.home.score || match.away.score ? ':' : 'v' }}</div>
      <div
        class="score-block away clickable"
        v-tooltip="tooltip(`Click to view ${match.away.name} Scores`)"
        @click="fetchTeamScores(match.away.id)"
      >
        <p class="team-score">{{ match.away.score }}</p>
        <p class="team-name">{{ match.away.name }}</p>
        <p class="team-location">Away</p>
      </div>
    </div>
    <!-- Match Meta Info -->
    <div class="match-info">
      <p class="status">{{ match.status }} </p>
      <p class="league" @click="fetchLeagueScores(match.leagueId)">
        {{ match.league }}, {{ match.season }}
      </p>
      <p>
        <a :href="match.venue | mapsUrl">{{ match.venue }}</a>
        on {{ match.date | formatDate }} ({{ match.time | formatTime }})</p>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { timestampToDate, getPlaceUrl } from '@/utils/MiscHelpers';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      currentTeamId: null, // ID of the selected team
      currentLeagueId: null, // ID of selected league
      whenToShow: null, // Either 'past' or 'future'
      whatToShow: null, // Either 'team' or 'league'
      matches: null, // Array of matches returned
      initiated: false, // Set to true once values set
    };
  },
  computed: {
    teamId() {
      return this.options.teamId;
    },
    leagueId() {
      return this.options.leagueId;
    },
    apiKey() {
      return this.options.apiKey || '50130162';
    },
    limit() {
      return this.options.limit || 20;
    },
    pastOrFuture() {
      return this.options.pastOrFuture || 'past';
    },
    hideImage() {
      return this.options.hideImage || false;
    },
    endpoint() {
      this.initiate();
      const endpoint = widgetApiEndpoints.sportsScores;
      if (this.whatToShow === 'league' && this.whenToShow === 'future') {
        return `${endpoint}/${this.apiKey}/eventsnextleague.php?id=${this.currentLeagueId}`;
      } else if (this.whatToShow === 'league' && this.whenToShow === 'past') {
        return `${endpoint}/${this.apiKey}/eventspastleague.php?id=${this.currentLeagueId}`;
      } else if (this.whatToShow === 'team' && this.whenToShow === 'future') {
        return `${endpoint}/${this.apiKey}/eventsnext.php?id=${this.currentTeamId}`;
      } else if (this.whatToShow === 'team' && this.whenToShow === 'past') {
        return `${endpoint}/${this.apiKey}/eventslast.php?id=${this.currentTeamId}`;
      } else {
        this.error('Missing team or league ID');
        return '';
      }
    },
  },
  filters: {
    formatDate(dateStr) {
      return timestampToDate(dateStr);
    },
    formatTime(timeStr) {
      if (!timeStr) return '';
      return timeStr.slice(0, 5);
    },
    mapsUrl(placeName) {
      return getPlaceUrl(placeName);
    },
  },
  methods: {
    initiate() {
      if (!this.initiated) {
        this.currentTeamId = this.teamId;
        this.currentLeagueId = this.leagueId;
        this.whenToShow = this.pastOrFuture;
        this.whatToShow = this.teamOrLeague();
        this.initiated = true;
      }
    },
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data.results || response.data.events);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data', dataFetchError);
          this.finishLoading();
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    processData(data) {
      const matches = [];
      data.forEach((match) => {
        matches.push({
          id: match.idEvent,
          sport: match.strSport,
          title: match.strEvent,
          league: match.strLeague,
          leagueId: match.idLeague,
          season: match.strSeason,
          venue: match.strVenue,
          date: match.dateEvent,
          time: match.strTime,
          status: match.strStatus,
          thumbnail: match.strThumb,
          home: {
            id: match.idHomeTeam,
            name: match.strHomeTeam,
            score: match.intHomeScore,
          },
          away: {
            id: match.idAwayTeam,
            name: match.strAwayTeam,
            score: match.intAwayScore,
          },
        });
      });
      this.matches = matches.slice(0, this.limit);
    },
    teamOrLeague() {
      if (!this.currentTeamId && !this.currentLeagueId) {
        this.error('You must specify either a teamId or leagueId');
      }
      if (this.currentTeamId) return 'team';
      return 'league';
    },
    fetchTeamScores(teamId) {
      if (teamId) {
        this.whatToShow = 'team';
        this.startLoading();
        this.currentTeamId = teamId;
        this.fetchData();
      }
    },
    fetchLeagueScores(leagueId) {
      if (leagueId) {
        this.whatToShow = 'league';
        this.startLoading();
        this.currentLeagueId = leagueId;
        this.fetchData();
      }
    },
    fetchPastFutureEvents(pastOrFuture) {
      this.startLoading();
      this.whenToShow = pastOrFuture;
      this.fetchData();
    },
    tooltip(content) {
      return {
        content, html: true, trigger: 'hover focus', delay: 250,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.sports-scores-wrapper {
 p {
    font-size: 1rem;
    margin: 0.5rem auto;
    color: var(--widget-text-color);
  }
  .match-row {
    .match-thumbnail-wrap {
      width: 80%;
      max-height: 5rem;
      display: flex;
      border-radius: var(--curve-factor);
      margin: 1rem auto 0.5rem auto;
      overflow: hidden;
      img.match-thumbnail {
        width: 100%;
        height: fit-content;
        margin-top: -13%;
      }
    }
    .score {
      display: flex;
      justify-content: space-around;
      .score-block {
        display: flex;
        flex-direction: column;
        min-width: 40%;
        border: 1px solid transparent;
        border-radius: var(--curve-factor);
        p.team-score {
          margin: 0.25rem auto;
          font-size: 1.5rem;
          font-weight: bold;
          font-family: var(--font-monospace);
        }
        p.team-name {
          text-align: center;
          margin: 0;
        }
        p.team-location {
          font-size: 0.8rem;
          margin: 0 auto;
          opacity: var(--dimming-factor);
        }
        &.clickable {
          cursor: pointer;
          &:hover {
            border: 1px dashed var(--widget-text-color);
          }
        }
      }
      .colon {
        margin: 0;
        font-size: 2rem;
        font-weight: bold;
        color: var(--widget-text-color);
      }
    }
    .match-info {
      background: var(--widget-accent-color);
      border-radius: var(--curve-factor);
      padding: 0.25rem 0.5rem;
      margin: 0.5rem auto 1rem auto;
      p, a {
        color: var(--widget-text-color);
        opacity: var(--dimming-factor);
        font-size: 0.8rem;
        margin: 0;
        &.status {
          font-weight: bold;
        }
        &.league {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
  p.back-to-original {
    cursor: pointer;
    font-size: 1rem;
    padding: 0.1rem 0.25rem;
    width: 100%;
    color: var(--widget-text-color);
    border-radius: var(--curve-factor);
    text-decoration: underline;
    text-align: left;
  }
  .past-or-future {
    width: 100%;
    color: var(--widget-text-color);
    border-bottom: 1px dashed var(--widget-text-color);
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-evenly;
    span.btn {
      max-width: 50%;
      cursor: pointer;
      padding: 0.1rem 0.25rem;
      border-radius: var(--curve-factor);
      &.selected {
        background: var(--widget-text-color);
        color: var(--widget-background-color);
      }
      &:hover {
        font-weight: bold;
      }
    }
  }
}

</style>
