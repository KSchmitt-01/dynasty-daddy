/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SleeperApiConfigService } from './sleeper-api-config.service';
import { LeagueCompletedPickDTO } from '../../../model/league/LeagueCompletedPickDTO';
import { LeagueRosterDTO } from '../../../model/league/LeagueRosterDTO';
import { LeaguePlayoffMatchUpDTO } from '../../../model/league/LeaguePlayoffMatchUpDTO';
import { LeagueOwnerDTO } from '../../../model/league/LeagueOwnerDTO';
import { LeagueRawDraftOrderDTO } from '../../../model/league/LeagueRawDraftOrderDTO';
import { TeamMetrics } from '../../../model/league/TeamMetrics';
import { StateOfNFLDTO } from '../../../model/league/StateOfNFLDTO';
import { LeagueRawTradePicksDTO } from '../../../model/league/LeagueRawTradePicksDTO';
import { LeaguePlatform } from '../../../model/league/FantasyPlatformDTO';
import { LeagueUserDTO } from '../../../model/league/LeagueUserDTO';
import { LeagueDTO } from '../../../model/league/LeagueDTO';


@Injectable({
  providedIn: 'root'
})
export class SleeperApiService {

  constructor(private http: HttpClient, private sleeperApiConfigService: SleeperApiConfigService) {
  }

  /**
   * get sleeper user info
   * @param userName user name in sleeper
   */
  getSleeperUserInformation(userName: string): Observable<LeagueUserDTO> {
    return this.http.get<LeagueUserDTO>(this.sleeperApiConfigService.getSleeperUsernameEndpoint + userName);
  }

  /**
   * get leagues by user id
   * @param userId user id
   * @param year year of leagues
   */
  getSleeperLeaguesByUserID(userId: string, year: string): Observable<LeagueDTO[]> {
    return this.http.get<LeagueDTO[]>(this.sleeperApiConfigService.getSleeperUsernameEndpoint + userId + '/leagues/nfl/' + year).pipe(map((leagues: any[]) => {
      const leagueList: LeagueDTO[] = [];
      leagues.map(league => leagueList.push(new LeagueDTO().fromSleeper(league?.roster_positions?.includes('SUPER_FLEX'), league.name, league.league_id, league.total_rosters, league.roster_positions, league.previous_league_id, league.status, league.season, league.metadata, league.settings, league.scoring_settings, LeaguePlatform.SLEEPER)));
      return leagueList;
    }));
  }

  /**
   * get sleeper rosters by league id
   * @param leagueId selected league id
   */
  getSleeperRostersByLeagueId(leagueId: string): Observable<LeagueRosterDTO[]> {
    return this.http.get<LeagueRosterDTO[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/rosters').pipe(map((rosters: any[]) => {
      const rosterList: LeagueRosterDTO[] = [];
      rosters.map(roster => rosterList.push(new LeagueRosterDTO()
        .fromSleeper(roster.roster_id, roster.owner_id, roster.players, roster.reserve, roster.taxi, new TeamMetrics().fromSleeper(roster.settings))
      ));
      return rosterList;
    }));
  }

  /**
   * get league data by league id
   * @param leagueId selected league id
   */
  getSleeperLeagueByLeagueId(leagueId: string): Observable<LeagueDTO> {
    return this.http.get<LeagueRosterDTO[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId).pipe(map((league: any) => {
      return new LeagueDTO().fromSleeper(league.roster_positions.includes('SUPER_FLEX'), league.name, league.league_id, league.total_rosters, league.roster_positions, league.previous_league_id, league.status, league.season, league.metadata, league.settings, league.scoring_settings, LeaguePlatform.SLEEPER);
    }));
  }

  /**
   * get team owner details from league id
   * @param leagueId league id
   */
  getSleeperOwnersbyLeagueId(leagueId: string): Observable<LeagueOwnerDTO[]> {
    return this.http.get<LeagueOwnerDTO[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/users').pipe(map((owners: any[]) => {
      const ownerList: LeagueOwnerDTO[] = [];
      owners.map(owner => ownerList.push(new LeagueOwnerDTO(owner.user_id, owner.display_name, owner.metadata.team_name, owner.avatar)));
      return ownerList;
    }));
  }

  /**
   * get draft from league id
   * @param leagueId league id
   */
  getSleeperDraftbyLeagueId(leagueId: string): Observable<string[]> {
    return this.http.get<string[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/drafts').pipe(map((drafts: any[]) => {
      const draftList: string[] = [];
      drafts.map(draft => draftList.push(draft.draft_id));
      return draftList;
    }));
  }

  /**
   * get draft details from draft id
   * @param draftId draft id
   */
  getSleeperDraftDetailsByDraftId(draftId: string): Observable<LeagueRawDraftOrderDTO> {
    return this.http.get<LeagueRawDraftOrderDTO>(this.sleeperApiConfigService.getSleeperDraftEndpoint + draftId).pipe(map((draft: any) => {
      return new LeagueRawDraftOrderDTO().fromSleeper(draft.draft_id, draft.league_id, draft.status, draft.type, draft.draft_order, draft.slot_to_roster_id, draft.season, draft.settings);
    }));
  }

  /**
   * get traded draft picks by draft id
   * @param draftId draft id
   */
  getSleeperTradedPicksByDraftId(draftId: string): Observable<LeagueRawTradePicksDTO[]> {
    return this.http.get<LeagueRawTradePicksDTO[]>(this.sleeperApiConfigService.getSleeperDraftEndpoint + draftId + '/traded_picks').pipe(map((picks: any[]) => {
      const pickList: LeagueRawTradePicksDTO[] = [];
      picks.map(pick => pickList.push(new LeagueRawTradePicksDTO(pick.owner_id, pick.previous_owner_id, pick.roster_id, pick.round, pick.season)));
      return pickList;
    }));
  }

  /**
   * get traded draft picks by league id
   * @param leagueId league id
   */
  getSleeperTradedPicksByLeagueId(leagueId: string): Observable<LeagueRawTradePicksDTO[]> {
    return this.http.get<LeagueRawTradePicksDTO[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/traded_picks').pipe(map((picks: any[]) => {
      const pickList: LeagueRawTradePicksDTO[] = [];
      picks.map(pick => pickList.push(new LeagueRawTradePicksDTO(pick.owner_id, pick.previous_owner_id, pick.roster_id, pick.round, pick.season)));
      return pickList;
    }));
  }

  /**
   * get playoffs
   * @param leagueId league id
   */
  getSleeperPlayoffsByLeagueId(leagueId: string): Observable<LeaguePlayoffMatchUpDTO[]> {
    return this.http.get<LeaguePlayoffMatchUpDTO[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/winners_bracket').pipe(map((playoffs: any[]) => {
      const matchups: LeaguePlayoffMatchUpDTO[] = [];
      playoffs.map(game => matchups.push(new LeaguePlayoffMatchUpDTO(game)));
      return matchups;
    }));
  }


  /**
   * get sleeper matchups for week by league id
   * @param leagueId league id
   * @param weekNumber week number
   */
  getSleeperMatchUpsForWeekByLeagueId(leagueId: string, weekNumber: number): Observable<any> {
    return this.http.get<any[]>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/matchups/' + weekNumber).pipe(map((weekMatchups: any[]) => {
      return weekMatchups;
    }));
  }

  /**
   * get sleeper completed drafts by draft id
   * @param draftId draft id
   */
  getSleeperCompletedDraftsByDraftId(draftId: string): Observable<LeagueCompletedPickDTO[]> {
    return this.http.get<LeagueCompletedPickDTO[]>(this.sleeperApiConfigService.getSleeperDraftEndpoint + draftId + '/picks').pipe(map((picks: any[]) => {
      const mappedPicks: LeagueCompletedPickDTO[] = [];
      picks.map(pick => mappedPicks.push(new LeagueCompletedPickDTO().fromSleeper(pick)));
      return mappedPicks;
    }));
  }

  /**
   * get sleeper stats for a year
   * @param year year number
   */
  getSleeperStatsForYear(year: string): Observable<any> {
    return this.http.get<any>(this.sleeperApiConfigService.getSleeperStatsEndpoint + year).pipe(map((stats: any) => {
      return stats;
    }));
  }

  /**
   * get current state of sleeper
   */
  getSleeperStateOfNFL(): Observable<StateOfNFLDTO> {
    return this.http.get<any>(this.sleeperApiConfigService.getSleeperNFLStateEndpoint).pipe(map((season: any) => {
      return new StateOfNFLDTO(season);
    }));
  }

  /**
   * get sleeper stats by week
   * @param year year
   * @param weekNum week num
   */
  getSleeperStatsForWeek(year: string, weekNum: number): Observable<any> {
    return this.http.get<any>(this.sleeperApiConfigService.getSleeperStatsEndpoint + year + '/' + weekNum).pipe(map((stats: any) => {
      return stats;
    }));
  }

  /**
   * get sleeper projections for week
   * @param year year
   * @param weekNum weeknum
   */
  getSleeperProjectionsForWeek(year: string, weekNum: number): Observable<any> {
    return this.http.get<any>(this.sleeperApiConfigService.getSleeperProjectionsEndpoint + year + '/' + weekNum).pipe(map((stats: any) => {
      return stats;
    }));
  }

  /**
   * get sleeper transaction by league for week
   * @param leagueId string
   * @param weekNum number
   */
  getSleeperTransactionByLeagueIdForWeek(leagueId: string, weekNum: number): Observable<any> {
    return this.http.get<any>(this.sleeperApiConfigService.getSleeperLeagueEndpoint + leagueId + '/transactions/' + weekNum).pipe(map((transactions: any) => {
      return transactions;
    }));
  }

  /**
   * fetches all players in sleeper with sleeper ids
   */
  fetchAllSleeperPlayers(): Observable<any> {
    return this.http.get<any>(this.sleeperApiConfigService.getSleeperPlayersEndpoint);
  }
}
