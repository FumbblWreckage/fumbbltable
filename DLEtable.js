// ==UserScript==
// @name        DLE NFL Style Sheet
// @namespace   http://localhost
// @description Lists all the groups for NAF tournaments
// @include     https://fumbbl.com/p/notes?op=view&id=7463
// @include     https://fumbbl.com/p/notes?op=edit&id=7463
// @require  https://code.jquery.com/jquery-3.1.0.min.js
// @version     1
// @grant       none
// ==/UserScript==

(function() {


//Inventory
//A. DLEscopeWrapper
//
//	I.Global Variables
//		1, Page Acccess Variables
// 		2. Dynamic Information Holders
// 		3. Predefined Editable Information Objects gathered in Array Variables
//	II. GetXML Functions ->trigger->
//	III. Main Function
//		1. Read out DLE files
//			a) Read out General Group XML Information
//			b) Read out Specific Tournament XML Informations
//			c) Add Concession Informations
//	 	2. Generate Table Informations
//			-  Generate Division Tables As Template Into Note
// 				aa) Add Conference Tables
//				bb) Add League Table
//				cc) Add Playoff Table
//		3. Timer to Refresh Page
//	IV. Function Templates for Objects
//
//B. Generally useful Functions (not wrapped)
	

DLEscopeWrapper();

function DLEscopeWrapper() {

function tourneyList() {
		var a = [];
  a.push(new tourneyObject(48007, 1));
  a.push(new tourneyObject(48107, 1));
  a.push(new tourneyObject(48108, 1));
  a.push(new tourneyObject(48109, 1));
   a.push(new tourneyObject(48110, 1));
/*  a.push(new tourneyObject(47060, 1));
a.push(new tourneyObject(47106, 1));
  a.push(new tourneyObject(47107, 1));
  a.push(new tourneyObject(47108, 1));
  a.push(new tourneyObject(47109, 1));
 
 		a.push(new tourneyObject(47411, 2));
		a.push(new tourneyObject(47412, 2));
		a.push(new tourneyObject(47413, 2));
		a.push(new tourneyObject(47414, 2));*/

	
	


		return a;
	}

	function teamList() {
  
		var a = [];
		function adC(teamName, teamsDivision, teamsImage, sync) {
			a.push(new coachObject(teamName, teamsDivision, teamsImage, sync));
		}
		adC("Cardinals", "KFC North", "/i/480499");
		adC("Universe", "KFC North", "/i/479678");
		adC("Unicorns", "KFC North", "/i/480908");
		adC("Foxes", "KFC North", "/i/496603");

		adC("River Bandits", "KFC East", "/i/562734");
		adC("Gunners", "KFC East", "/i/529516");
		adC("Sluggers", "KFC East", "/i/505864");
		adC("Templehof", "KFC East", "/i/478946", "857466");

		adC("Eagles", "KFC South", "/i/482984", "835244");
		adC("Razorbacks", "KFC South", "/i/480937");
		adC("49ers", "KFC South", "/i/517281");
		adC("Scimitars", "KFC South", "/i/481074");

		adC("Thunderbolts", "KFC West", "/i/479006");
		adC("Patriots", "KFC West", "/i/479366");
		adC("Griffins", "KFC West", "/i/485849");
		adC("Classics", "KFC West", "/i/496280", "842513");

		adC("Crimson Cascade", "SHC North", "/i/502263");
		adC("Vikings", "SHC North", "/i/498524");
		adC("Grizzlies", "SHC North", "/i/499756");
		adC("Wolfskins", "SHC North", "/i/533870");

		adC("Rangers", "SHC East", "https://cdn.discordapp.com/attachments/403218376346042368/589822715431616532/ranges-new50x34.png", "835848");
		adC("Legion", "SHC East", "/i/481066", "853675");
		adC("Greenskins", "SHC East", "/i/503963");
		adC("Manticores", "SHC East", "https://cdn.discordapp.com/attachments/309977217625096194/309979927598596097/logo.png");

		adC("Bruisers", "SHC South", "/i/498689");
		adC("Buccaneers", "SHC South", "/i/483042");
		adC("Avalanche", "SHC South", "/i/499233");
		adC("Wreckers", "SHC South", "/i/501631");

		adC("White Wolves", "SHC West", "/i/502311", "837167");
		adC("Knights", "SHC West", "/i/501253");
		adC("Marauders", "SHC West", "/i/499240", ["866836","844323"]);
		adC("Sharks", "SHC West", "/i/499392");
		return a;
	}
	function generateConcessions() {
		var colrabi = [];
   /* exCon("Knights","White Wolves",1,10)
    exCon("Grizzlies", "White Wolves",3,11)
    exCon("Wolfskins", "White Wolves",3,12)
    exCon("49ers","Gunners",3,14)
    exCon("49ers","Razorbacks",3,16)
    exCon("Rangers","Bruisers",6,16)
    //    exCon("Patriots","Universe",0,5)*/

		function exCon(winner, loser, tournygroup, round) {
			colrabi.push(new concession(findSegment(winner), findSegment(loser), tournys[tournygroup], round));
		}

		return colrabi;

	}
  
  function generateScorePenalty() {
		
    // addScorePenalty(findSegment("Unicorns"));


	}
	
	if (checkSiteName() !== 1)
		return;

	//true variables
	var groupID = 10068;
	var writeArea = document.getElementById("noteedit");


	//values that should not be changed
	var tournys = tourneyList();
	var NoOfXMLsNeeded = tournys.length + 1; //all tourney files and one extra for the group file... If I wanted to add multiple group files I had to define parameters for the +1...
	var NoOfXMLsreceived = 0;
	var groupXMLlist;
	var tourneyXMLlist = [];
	var tourneyXMLorder = [];
	var tiebreak = [];
	var tiebreak2 = [];
	var fullcount = 0;
	var totalTW;
	var averageTW;
	var totalGames;
	var ofTW85;

	var divs = divList();
	var DLE = teamList();
	var conferences = confList();
	 addConferencesToDivs();
	var concessions = generateConcessions();
	var league = leagueObject();
	var quitters = successorList();
	var penalties = penaltyList();
 
	getGroupXML();
	getTourneyXMLs();
  

	function addConferencesToDivs(){
		divs.forEach(function (div){
		if (div.conference==="KFC"){
		div.conf=conferences[0];}
		else if (div.conference==="SHC"){
		div.conf=conferences[1];
		}


		})


	}

	function findSegment(segment) {
		var targetCoach;

		DLE.forEach(function (coach) {
			if (coach.teamsegment == segment) {
				targetCoach = coach
					return;
			}
		}, targetCoach)

		return targetCoach;
	}

	//triggers through XML load
	

	function mainFunction() {
		generateDLEdata();
    
		sortTables();

		for (var x in DLE[21]) {

			var d2 = DLE[21]
				console.log(x + ": " + d2[x])
				if (x == "played") {
					d2[x].forEach(function (coachname) {
						console.log(coachname.coachname);

					})

				}
		}


		updateTables();

		window.setTimeout(function () {
			proceedUpdatingGrouplister();
		}, 1000 * 60);

	}

	function leagueObject() {
		this.name = "Draft League Europe";
		this.coaches = DLE;
	}

	function sortTables() {
		sortDivTables();
		sortConferenceTabels();
		//sortLeagueTable():
	}

	function concession(winning, losing, tournament, round) {
		this.winning = winning;
		this.losing = losing;
		this.tournament = tournament;
		this.round = round;

	}

	function sortLeagueTable() {
		var thisArray;
		var top = [];
		var bottom = [];
		league.coaches = [];
		divisions.forEach(function (divison) {
			division.coaches.forEach(function (coach, index) {
				if (index < 6) {
					coach.leaguetop = true;
					top.push(coach);
					coach.leaguetie = "Play-Off Standing"
				} else
					coach.leaguebottom = true;
				bottom.push(coach);

			})

		});

		top.sort(easyTie("confpercentage", "faketie", "League Break: Conference Percentage"));
		top.sort(easyTie("opponentperc", "faketie", "League Break: Opponent Percentage (Primary Tiebreak)"));
		top.sort(easyTie("winpercentage", "faketie", ""));

		bottom.sort(easyTie("confpercentage", "leaguetie", "League Break: Conference Percentage"));
		bottom.sort(easyTie("opponentperc", "leaguetie", "League Break: Opponent Percentage (Primary Tiebreak)"));
		bottom.sort(easyTie("winpercentage", "leaguetie", ""));

		thisArray = top.concat(bottom);

		league.coaches = thisArray;

		return thisArray;

	}



	function changeProperty(target, property, newvalue) {
		var i,
		tL,
		instance;
		i = 0;
		tL = target.length;
		for (i = 0; i < tL; i++) {
			instance = target[i];
			instance[property] = newvalue;

		}
	}

	function sortConferenceTabels() {

		addCoachesToConferences();
		conferences.forEach(function (conf) {
			var upper = [];
			var lower = [];
			upper = confTieBreakers(conf.top);
			lower = confTieBreakers(conf.bottom);

			conf.coaches = [];

			conf.coaches = upper.concat(lower);

			conf.coaches.forEach(function (thatcoach, ind) {
				console.log((ind + 1) + ". " + thatcoach.coachname + " " + thatcoach.divisionname + " " + thatcoach.conbreaker + " " + thatcoach.displayPercentage + " " + thatcoach.divdisplayPercentage);

			});

		});
	}

	function confTieBreakers(confpart) {
		var confSortCriteria = ["winpercentage", "head2head", "confpercentage", "opponentperc", "TDdif", "CASdif", "confTDdif", "confCASdif"]
		var corrected = [];
		corrected = sorterScript(confpart, "conf", confSortCriteria, 0)
			return corrected;
	}

	function addCoachesToDivision() {
		DLE.forEach(function (coach) {
			divs.forEach(function (div) {
				//	console.log(div.division+" and  "+coach.divisionname )
				if (div.division === coach.divisionname) {

					div.coaches.push(coach);
				}

			});
		});

	}

	function addCoachesToConferences() {
		DLE.forEach(function (coach) {

			if (coach.conference == "KFC") {

				conferences[0].coaches.push(coach);
				if (coach.divisionfirst) {
					conferences[0].top.push(coach);
				} else {
					conferences[0].bottom.push(coach);
				}

			} else {
				conferences[1].coaches.push(coach);
				if (coach.divisionfirst) {
					conferences[1].top.push(coach);
				} else {
					conferences[1].bottom.push(coach);
					//	console.log(coach.coachname+" "+coach.conference)
				}
			}
		});

	}

	function sortDivTables() {
		addCoachesToDivision();
		var divSortCriteria = ["winpercentage", "head2head", "divpercentage", "confpercentage", "opponentperc", "TDdif", "CASdif", "confTDdif", "confCASdif"]
		divs.forEach(function (div) {
			var tempCoaches = div.coaches;
			div.coaches = [];
			div.coaches = sorterScript(tempCoaches, "div", divSortCriteria, 0);
			div.coaches[0].divisionfirst = true;
		});

	}

	function head2head(target, tiebreakername, oldtiebreaker, isConf) {
		var tiear = [];
		var tiecase = [];
		var i = 0;
		var c = target;
		var a;
		var b;
		var d;
		var locker = -10;
		var f;
		var beatlength;
		var wasbeatlength;
		var winarray = [];
		var losearray = [];

		for (i = 1; i < c.length; i++) {
			a = c[i - 1];
			b = c[i];
			if (!isConf) {
				if (a.tiebreaker == oldtiebreaker && a.tiebreaker == b.tiebreaker && a.lockedinat == b.lockedinat) {
					if (a.lockedinat !== locker) {
						tiecase[i] = [];
						d = tiecase[i];
						d.push(a);
						d.push(b);
						console.log(a.lockedinat)
						locker = a.lockedinat;

					} else {
						d.push(b);
						console.log(a.lockedinat)
						//

					}

				}
			} else {
				if (a.conbreaker == oldtiebreaker && a.conbreaker == b.conbreaker && a.lockedinat == b.lockedinat) {
					if (a.lockedinat !== locker) {
						tiecase[i] = [];
						d = tiecase[i];
						d.push(a);
						d.push(b);
						console.log(a.lockedinat)
						locker = a.lockedinat;

					} else {
						d.push(b);
						console.log(a.lockedinat)
						//

					}

				}
			}
			if (d === tiecase[i]) {
				console.log("tiecase: " + i)

				if (d)
					d.forEach(function (g) {

						console.log(g.coachname);

					});

			}
		}

		var zed;
		var j;

		for (j = 1; j < tiecase.length; j++) {
			if (!tiecase[j]) {
				continue;
			}
			f = tiecase[j];
			cutOffMember();
			for (zed = 0; zed < winarray.length; zed++) {
				if (winarray[zed])
					target[j - 1 + zed] = winarray[zed];

			}
			for (zed = 0; zed < f.length; zed++) {
				if (f[zed + winarray.length]) {
					if (!isConf)
						f[zed + winarray.length].tiebreaker = tiebreakername;
					else
						f[zed + winarray.length].conbreaker = tiebreakername;
					//window.alert(f[zed+winarray.length].coachname+" pos: "+j+" rotation: "+zed )
					target[j - 1 + zed + winarray.length] = f[zed + winarray.length];
				}

			}
			for (zed = 0; zed < losearray.length; zed++) {

				if (losearray[zed + winarray.length + f.length])
					target[j - 1 + zed + winarray.length + f.length] = losearray[zed + winarray.length + f.length];

			}
			/*console.log(winarray.length)
			console.log(target)
			console.log(losearray)
			 */
		}
		function cutOffMember() {
			var reset = false;

			if (f.length > 0) {
				f.forEach(function (coachbeater, index) {
					if (reset == true) {}
					else {
						beatlength = 0;
						wasbeatlength = 0;
						f.forEach(function (coachbeaten, index2) {
							if (coachbeater.beat && coachbeater.beat.indexOf(coachbeaten) > -1)
								beatlength++;
						});
						if (beatlength == f.length) {
							winarray.push(coachbeater);
							f.splice(index, 1);
							cufOffMember();
							reset = true;
						}

						f.forEach(function (coachvictim) {
							if (coachbeater.wasbeaten && coachbeater.wasbeaten.indexOf(coachvictim) > -1)
								wasbeatlength++;
						});
						if (beatlength == f.length) {
							losearray.push(coachbeater);
							f.splice(index, 1);
							cufOffMember();
							reset = true;
						}
					}
				});
			}

		}

	}

	function conditionalTieBreaker(target, tieprop, tiebreakername, oldtiebreaker, isConf) {
		if (isConf === undefined) {
			isConf = false;

		}
		var tiear = [];
		var divcheck;
		var oneprop = 0;
		var sameprop = 0;
		var ofNote = 0;
		var ofImportance = 0;
		var i;
		var n = 1;
		target.forEach(function (guy, next) {

			if (target[next + 1] && guy.conbreaker == target[next + 1].conbreaker && guy.conbreaker !== "" && guy.lockedinat == target[next + 1].lockedinat) {
				ofNote++;
				if (guy.divisionname == target[next + 1].divisionname) {
					ofImportance++;

				}
			} else if (ofNote !== ofImportance && ofNote > 0) {
				if (!target[next + 1]) {
					n = 0;
				}
				for (i = 0; i < ofNote + 1; i++) {

					target[next - i].conbreaker = tiebreakername;
					//	target[next-i].lockedinat = target[next-i][tieprop];

				}
				ofNote = 0;
				ofImportance = 0;
				n = 1;
			}

		});
		ofNote = 0;
		ofImportance = 0;
		n = 1;

		target.sort(tieCast(tiear, tieprop, oldtiebreaker, isConf));

		tiear.forEach(function (coach, ind) {
			//
			if (isConf) {
				coach.conbreaker = tiebreakername;
			} else {
				coach.tiebreaker = tiebreakername;
			}
			coach.lockedinat = coach[tieprop];
			/*	if (tiear[ind].tieprop==tiear[ind+1].tieprop){
			oneprop++;
			if (tiear[ind].)

			}*/
		});

	}

	function determineTieBreaker(target, tieprop, tiebreakername, oldtiebreaker, environment) {

		var tiear = [];
		var divcheck;
		var oneprop = 0;
		var sameprop = 0;
		target.sort(tieCast(tiear, tieprop, oldtiebreaker));

		tiear.forEach(function (coach, ind) {
			//
			coach[environment + "breaker"] = tiebreakername;

			coach.lockedinat = coach[tieprop];
			/*	if (tiear[ind].tieprop==tiear[ind+1].tieprop){
			oneprop++;
			if (tiear[ind].)

			}*/
		});

	}

	function easyTie(prop) {
		return function (a, b) {

			return b[prop] - a[prop];

		}

	}

	function conditionalTie(prop, environment, tiebreak) {
		return function (a, b) {

			if (b[prop] - a[prop] != 0) {
				a[environment] = tiebreak;
				b[environment] = tiebreak;

			}

			return b[prop] - a[prop];

		}
	}

	function tieCast(tiear, tieprop, oldtiebreaker, isConf) {

		return function (a, b) {

			if ((isConf && oldtiebreaker && (a.conbreaker !== oldtiebreaker || a.conbreaker !== b.conbreaker || a.lockedinat !== b.lockedinat)) || (!isConf && oldtiebreaker && (a.tiebreaker !== oldtiebreaker || a.tiebreaker !== b.tiebreaker || a.lockedinat !== b.lockedinat))) {

				return 0;

			} else if (a[tieprop] !== b[tieprop] && a[tieprop] != "no data" && b[tieprop] != "no data") { //base condition

				return b[tieprop] - a[tieprop];
			} else {
				if (tiebreak.indexOf(a) === -1) {
					tiear.push(a);
				}
				if (tiebreak.indexOf(b) === -1) {
					tiear.push(b);
				}
				return 0;
			}

		}
	}

	function checkHowManyXMLsAreStillNeeded() {
		NoOfXMLsreceived++;
		if (NoOfXMLsreceived == NoOfXMLsNeeded)
			mainFunction();
		if (NoOfXMLsreceived > NoOfXMLsNeeded) {
			window.alert("XML OVERLOAD!!!")

		}
	}

	function checkSiteName() {
		var pN = window.location.href.toString();
		var pP = pN.slice(18);

		if (pP === "/p/notes?op=edit&id=7463") {

			//	generateDLEdata();
			return 1;
		} else {
			if (pP === "/p/notes?op=view&id=7463") {
				startTimerForUpdate(1000 * 60 * 10);
			}

			return 0;
		}

	}

	function generateDLEdata() {

		evaluateGroupData();

		evaluateIndividualMatches();
		calculateTotals();
   
		addConcessions();
    
		addPenalty();
     
		addOpponentstats();
generateScorePenalty();

	}

	function addOpponentstats() {
		DLE.forEach(function (coach) {
			if(coach.coachname=="FRSHM"){
coach.played.forEach(function(one){
console.log("enemies_ "+one.teamname)

})
}
			var i;
			var k;
			var len = coach.played.length;
			var uniqueNames = [];
$.each(coach.played, function(i, el){
    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
});
coach.played = [];

coach.played = uniqueNames;


uniqueNames=[];


			coach.played.forEach(function (opponent, index) {
				var timeOfGame = coach.played.valueOf(opponent);
				if (timeOfGame < index) {
					return;
				}
    	if(coach.coachname=="FRSHMN"){   console.log("Opponent-> Name: "+opponent.teamname+", Wins: "+opponent.win+ ", Ties: "+opponent.tie)} 
        
				coach.opponentwins += opponent.win;
				coach.opponentties += opponent.tie;
				coach.opponentloss += opponent.loss;
				coach.opponentgames += opponent.games;
				coach.opponentscore += 2*opponent.win+opponent.tie;

			});
			coach.opponentperc = calcPerc(coach.opponentscore, coach.opponentgames);
			coach.opponentP = percToString(coach.opponentperc);

			coach.beat.forEach(function (beatop) {
				coach.beatenscored += beatop.score;
				coach.beatengames += beatop.games;
				coach.beatenwins += beatop.win;
				coach.beatenties += beatop.tie;
				coach.beatenloss += beatop.loss;

			});

			coach.beatenperc = calcPerc(coach.beatenscored, coach.beatengames);
			coach.beatenP = percToString(coach.beatenperc);

		});

	}
	/*function addDivSpecificInfo(){
	divs.forEach(function (div){
	div.coaches.forEach(function (coach){



	})


	});
	}*/

	function findTieBreaker(coachList, arrayOfTieProperties) {
		var i;
		var len = coachList.length;

		for (i = 0; i < len; i++) {}
		arrayOfTieProperties.forEach(function (tieProperty) {});

	}

	function evaluateIndividualMatches() {
		var i;
		var zod = 0
			for (i = 0; i < tourneyXMLlist.length; i++) {
				var tourny = tourneyXMLorder[i];
				var matches = [].slice.call(tourneyXMLlist[i].getElementsByTagName("match"));

				matches.forEach(function (match) {

					var home = match.getElementsByTagName("home")[0];
					var away = match.getElementsByTagName("away")[0];
					var homecoach = false;
					var awaycoach = false;
					var homescore;
					var awayscore;

					tourny.coaches.forEach(function (coach) {
						//	console.log(coach.divisionname+" "+coach.coachname+" "+coach.teamID+" and "+home.id)


						if (coach.teamID.indexOf(home.id) !== -1) {

							homecoach = coach;

							homescore = parseInt(home.getElementsByTagName("TD")[0].textContent);
							addMatchDataToCoach(coach, home, away);

						}

						if (coach.teamID.indexOf(away.id) !== -1) {
							awaycoach = coach;

							awayscore = parseInt(away.getElementsByTagName("TD")[0].textContent);
							addMatchDataToCoach(coach, away, home);
						}

					});

					if (homecoach && awaycoach) {
						individualScores(homecoach, awaycoach, homescore, awayscore, home, away);
					}

				});

			}

	}

	function successorList() {
		var successors = [];
		successors.push(new expiredCoach("K2", 842513, findCoach("bigf")))
		return successors;
	}

	function expiredCoach(coachName, teamID, successor) {
		this.coach = coachName;
		this.teamID = [teamID];
		this.successor = successor;

	}

	function penaltyList() {
		var pList = [];

		return pList;

	}

	function addPenalty() {
		penalties.forEach(function (penalty) {
			var coach = findCoach(penalty.slice(0, (penalty.length - 1)));
			var environment = penalty.slice(penalty.length - 1)
				//window.alert(environment);
				coach.score += -1;
				coach.draftscore += 1;
			coach.concessions += 1;

			coach.winpercentage = calcPerc((coach.win * 2 + coach.tie - coach.concessions), coach.games);
			coach.displayPercentage = percToString(coach.winpercentage);

			coach.draftwinpercentage = calcPerc((coach.win * 2 + coach.tie + coach.concessions), coach.games);
			coach.draftdisplayPercentage = percToString(coach.draftwinpercentage);

			if (environment === "D") {

				concessionStats(coach, "div");
				concessionStats(coach, "conf");
			} else if (environment === "C") {

				concessionStats(coach, "conf");

			}

		})

	}

	function addScorePenalty(penalizedCoach) {
    penalizedCoach.draftscore += 1;
    penalizedCoach.draftpenalty = penalizedCoach.draftpenalty+1 || 1;
    
penalizedCoach.draftwinpercentage = calcPerc((penalizedCoach.win * 2 + penalizedCoach.tie + penalizedCoach.concessions+ penalizedCoach.draftpenalty), penalizedCoach.games);
			penalizedCoach.draftdisplayPercentage = percToString(penalizedCoach.draftwinpercentage);
	}


	function addConcessions() {
		var winner,
		loser;

		concessions.forEach(function (conceed) {
			winner = conceed.winning;
			loser = conceed.losing;

			winner.score += 2;
			winner.draftscore += 2;
			loser.score += -1;
			loser.draftscore += 1;

			winner.win += 1;
			loser.loss += 1;

			winner.games += 1;
			loser.games += 1;
			loser.concessions += 1;

			winner.winpercentage = calcPerc((winner.win * 2 + winner.tie - winner.concessions), winner.games);
			winner.displayPercentage = percToString(winner.winpercentage);

			loser.winpercentage = calcPerc((loser.win * 2 + loser.tie - loser.concessions), loser.games);
			loser.displayPercentage = percToString(loser.winpercentage);

			loser.draftwinpercentage = calcPerc((loser.win * 2 + loser.tie + loser.concessions), loser.games);
			loser.draftdisplayPercentage = percToString(loser.draftwinpercentage);

			whobeatwho(winner, loser);

			winner.TD += 2;
			winner.TDagainst += 0;
			winner.TDdif += 2;
			winner.TDandCASdif += 2;

			if (winner.divisionname == loser.divisionname) {

				fixStats(winner, loser, "div");
				concessionStats(loser, "div");
			}

			if (winner.conference == loser.conference) {
				fixStats(winner, loser, "conf");
				winner.confTD += 2;
				winner.confTDagainst += 0;
				winner.confTDdif += 2;
				winner.confTDandCASdif += 2;
				concessionStats(loser, "conf");

			}

			
		});

	}


	function concessionStats(coach, environment) {
		coach[environment + "concessions"] += 1;
		coach[environment + "score"] += -1;
		coach[environment + "percentage"] = calcPerc(((coach[environment + "wins"] * 2 + coach[environment + "tie"]) - coach[environment + "concessions"]), coach[environment + "games"]);

		coach[environment + "displayPercentage"] = percToString(coach[environment+"percentage"]);

		coach["draft" + environment + "score"] += 1;
		coach["draft" + environment + "percentage"] = calcPerc(((coach[environment + "wins"] * 2 + coach[environment + "tie"]) + coach[environment + "concessions"]), coach[environment + "games"]);

		coach["draft" + environment + "displayPercentage"] = percToString(coach["draft"+environment+"percentage"]);

	}

	function individualScores(homecoach, awaycoach, homescore, awayscore, home, away) {

		var divisn = "div";
		var confernce = "conf";
		//intentionally misspelled to avoid interferance;

		if (homescore - awayscore > 0) {
			whobeatwho(homecoach, awaycoach);
			if (homecoach.divisionname === awaycoach.divisionname)
				fixStats(homecoach, awaycoach, divisn);

			if (awaycoach.conference == homecoach.conference)
				fixStats(homecoach, awaycoach, confernce);

		} else if (awayscore - homescore > 0) {
			whobeatwho(awaycoach, homecoach);
			if (homecoach.divisionname === awaycoach.divisionname)
				fixStats(awaycoach, homecoach, divisn);

			if (awaycoach.conference == homecoach.conference)
				fixStats(awaycoach, homecoach, confernce);

		} else {

			if (homecoach.divisionname === awaycoach.divisionname) {
				tieStats(homecoach, awaycoach, divisn)

			}

			if (homecoach.conference === awaycoach.conference) {
				tieStats(homecoach, awaycoach, confernce)
			}
			homecoach.played.push(awaycoach);
			awaycoach.played.push(homecoach);

		}

		if (homecoach.conference === awaycoach.conference) {

			if (home) {
				var casscor = interpretCAS(home.getElementsByTagName("cas")[0]);
			} else {
				var casscor = 0
			}

			if (away) {
				var injur = interpretCAS(away.getElementsByTagName("cas")[0]);
			} else {
				var injur = 0
			}

			homecoach.confTD += homescore;
			homecoach.confTDagainst += awayscore;
			homecoach.confTDdif = homecoach.confTD - homecoach.confTDagainst;
			//	homecoach.confTDandCAS+=homescore-awayscore+;
			homecoach.confCASdif += casscor -injur;
			homecoach.confTDandCASdif += homescore - awayscore + casscor - injur;

			awaycoach.confTD += awayscore;
			awaycoach.confTDagainst += homescore;
			awaycoach.confTDdif = awaycoach.confTD - awaycoach.confTDagainst;
			//	awaycoach.confTDandCAS+=awayscore-homescore+;
			awaycoach.confCASdif += casscor -injur;
			awaycoach.confTDandCASdif += awayscore - homescore + injur - casscor;

		}

	}

	function tieStats(coach1, coach2, environment) {
		var games = environment + "games";
		var score = environment + "score";
		var draftscore = "draft"+score;
		var tie = environment + "tie";
		var percentage = environment + "percentage";
		var loss = environment + "loss";
		var displayPercentage = environment + "displayPercentage";

		if (coach1) {
			tieForCoach(coach1);
		}

		if (coach2) {
			tieForCoach(coach2);
		}

		if (coach1 && coach2) {
			if (coach1.played.indexOf(coach2) !== -1) {
				coach1.playedtwice.push(coach2);
				coach2.playedtwice.push(coach1);
				if (environment === "div") {
					if (coach1.beatingame1.indexOf(coach2) !== -1) {
						coach1.beat.push(coach2);
						coach2.wasbeat.push(coach1);
						console.log(coach1.coachname + " home beat after tie " + coach2.coachname)

					} else if (coach2.beatingame1.indexOf(coach1) !== -1) {
						coach2.beat.push(coach1);
						coach1.wasbeat.push(coach2);
						console.log(coach2.coachname + " away beat after tie " + coach1.coachname)
					}

				}
			}
		}

		function tieForCoach(coach) {
			coach[score] += 1;
			coach[draftscore]+=1;
			coach[games] += 1;
			coach[tie] += 1;
			coach[percentage] = calcPerc(coach[score], coach[games])
				coach[displayPercentage] = percToString(coach[percentage]);
		}

	}

	function fixStats(winner, loser, environment) {

		var games = environment + "games";
		var score = environment + "score";
		var draftscore = "draft"+score;
		var wins = environment + "wins";
		var percentage = environment + "percentage";
		var loss = environment + "loss";
		var displayPercentage = environment + "displayPercentage";

		if (winner) {
			winner[score] += 2;
			winner[draftscore] += 2;
			winner[games] += 1;
			winner[wins] += 1;
			winner[percentage] = calcPerc(winner[score], winner[games])
				winner[displayPercentage] = percToString(winner[percentage]);
		}

		if (loser) {
			loser[games] += 1;
			loser[loss] += 1;
			loser[percentage] = calcPerc(loser[score], loser[games])
				loser[displayPercentage] = percToString(loser[percentage]);
		}

	}

	function whobeatwho(homecoach, awaycoach) {
		if (homecoach.divisionname === awaycoach.divisionname) {
			if (homecoach.played.indexOf(awaycoach) == -1) {
				homecoach.played.push(awaycoach);
				awaycoach.played.push(homecoach);
				homecoach.beatingame1.push(awaycoach);
				awaycoach.wasbeatingame1.push(homecoach);
			} else {
				homecoach.played.push(awaycoach);
				awaycoach.played.push(homecoach);
				homecoach.playedtwice.push(awaycoach);
				awaycoach.playedtwice.push(homecoach);
				homecoach.beatingame2.push(awaycoach);
				awaycoach.wasbeatingame2.push(homecoach);
				if (homecoach.wasbeatingame1.indexOf(awaycoach) == -1) {
					homecoach.beat.push(awaycoach);
					awaycoach.wasbeat.push(homecoach);
					console.log(homecoach.coachname + " beat " + awaycoach.coachname)
				}

			}

		} else {
			homecoach.played.push(awaycoach);
			awaycoach.played.push(homecoach);
			homecoach.beat.push(awaycoach);
			awaycoach.wasbeat.push(homecoach);
			console.log(homecoach.coachname + " beat in non div game " + awaycoach.coachname)
		}

	}

	function addMatchDataToCoach(coach, match, away) {

		var thisscor = parseInt(match.getElementsByTagName("TD")[0].textContent);
		var opscor = parseInt(away.getElementsByTagName("TD")[0].textContent)
			var casscor = match.getElementsByTagName("cas")[0];
		var injur = away.getElementsByTagName("cas")[0];

		coach.TD = coach.TD + thisscor;
		coach.TDagainst = coach.TDagainst + opscor;
		coach.TDdif = coach.TD - coach.TDagainst;
		coach.TDandCAS = coach.TDandCAS + thisscor + interpretCAS(casscor);
		coach.CASdif = coach.CASdif + interpretCAS(casscor) - interpretCAS(injur);
		coach.TDandCASdif = coach.TDandCASdif + thisscor + interpretCAS(casscor) - opscor - interpretCAS(injur);
	}

	function generateMatchData(xmlMatches) {
		var matches = [].slice.call(groupXMLlist.getElementsByTagName("match"));

	}

	function interpretCAS(cas) {
		return parseInt(cas.getAttribute("bh")) + parseInt(cas.getAttribute("si")) + parseInt(cas.getAttribute("rip"));

	}

	function evaluateGroupData() {
		var tRef = [].slice.call(groupXMLlist.getElementsByTagName("tournament"));

		var relevantTourneys = [];
tournys.forEach(function (identicalQuali) {
		tRef.forEach(function (quali) {



				if (identicalQuali.tournamentID==quali.id) {

					compareQualiList(quali, identicalQuali);

				}

			});
		});

	}

	function compareQualiList(quali, tourni) {

		var coachesInQuali = [].slice.call(quali.getElementsByTagName("team"));

		DLE.forEach(function (coach) {
			coachesInQuali.forEach(function (qualiCoach) {

				if (getXMLtag("name", qualiCoach).search(coach.teamsegment) !== -1) {
					if (tourni.coaches.indexOf(coach) === -1) {
						tourni.coaches.push(coach)
					};

					if (coach.teamID.indexOf(qualiCoach.id) === -1) {
						coach.teamID.push(qualiCoach.id);
					}

					if (tourni.part == 1) {
						//		 fillOutEmptyStats(coach.t1);
						fillOutMissingCoachStats(qualiCoach, coach.t1, quali);
						//			fillOutEmptyStats(coach.t2);

					} else {

						if (tourni.part == 2) {

							fillOutMissingCoachStats(qualiCoach, coach.t2, quali);
						}

					}
					coach.coachname = getXMLtag("coach", qualiCoach); ;

					coach.tv = getXMLtag("teamValue", qualiCoach);
coach.tw = parseInt(getXMLtag("tournamentWeight", qualiCoach))*10;

					coach.teamname = getXMLtag("name", qualiCoach); //note: these values are only taken once since they are the same for second part of season

					//	coach.teamID = qualiCoach.id;
					coach.teamURL = "https://fumbbl.com/p/team?team_id=" + qualiCoach.id;


					coach.win = coach.t1.win + coach.t2.win;
					coach.loss = coach.t1.loss + coach.t2.loss
						coach.tie = coach.t1.tie + coach.t2.tie;
						coach.score = coach.t1.win*2+ coach.t1.tie  + coach.t2.win*2+coach.t2.tie;
						coach.draftscore=coach.score;
//console.log(coach.coachname+" total No of games: "+coach.games)
					coach.games = coach.t1.games + coach.t2.games;
			/*		console.log(coach.coachname+" total No of wins in t1: "+coach.t1.win)
					console.log(coach.coachname+" total No of losses in t1: "+coach.t1.loss)
					console.log(coach.coachname+" total No of tiees in t1: "+coach.t1.tie)
					console.log(coach.coachname+" games in t1:"+coach.t1.games);
*/


					coach.winpercentage = calcPerc((coach.win * 2 + coach.tie), coach.games);
					coach.displayPercentage = percToString(coach.winpercentage);
				}
			});
			DLE.forEach(function (coach2) {
				if (coach.divisionname === coach2.divisionname && coach !== coach2) {
					if (coach.divopponents.length < 3) {
						coach.divopponents.push(coach2);
						if (coach.divopponent1 === "nobody assigned")
							coach.divopponent1 = coach2;
						else if (coach.divopponent2 === "nobody assigned")
							coach.divopponent2 = coach2;
						else if (coach.divopponent3 === "nobody assigned")
							coach.divopponent3 = coach2;
						else
							window.alert("somehow too many coaches were assigned. You should have never received this message. This is bad.")
					}
				}

			});

		});
	}

	function fillOutMissingCoachStats(qualiCoach, co, quali) {
		if (quali) {
			var tourName = getXMLtag("name", quali);
			var tourNumber = quali.id;

			co.tname = tourName;
			co.tnumber = tourNumber;
		}
		//	console.log(co.coachname+" has score: "+parseInt(getXMLtag("score", qualiCoach)) )
		co.score += parseInt(getXMLtag("score", qualiCoach));

		co.win += parseInt(getXMLtag("win", qualiCoach));
		co.loss += parseInt(getXMLtag("lose", qualiCoach));
		co.tie += parseInt(getXMLtag("tie", qualiCoach));

	   co.games = co.tie + co.loss + co.win;



		co.percentage = calcPerc(co.score, co.games);
		co.displayPercentage = percToString(co.percentage)
	}

	function calcPerc(score, games) {
		var doet;
		if (games > 0) {
			doet = Math.round(score / 2 / games * 1000) / 1000;
		} else {
			doet = 0;
		}

		return doet;

	}

	function percToString(perc) {

		var stringPerc = perc.toString();

		if (perc == "no data") {

			stringPerc = "tTBD";
		}

		if (stringPerc.length === 4) {
			stringPerc += "0";
		} else if (stringPerc.length === 3) {
			stringPerc += "00";
		} else if (stringPerc.length === 1) {
			if (stringPerc == 1) {
				stringPerc = "0.999";
			} else {
				stringPerc = "0.000";
			}
		} else if (stringPerc.length === 0) {
			stringPerc = "0.000";
		}
		if (stringPerc == "tTBD0") {

			stringPerc = "tTBD";
		}

		if (stringPerc.slice(0, 1) != "-") {
			stringPerc = stringPerc.slice(1, 5);
		} else {
			stringPerc = stringPerc.slice(2, 5);
			stringPerc = "-" + stringPerc;

		}
		return stringPerc;
	}

	function fillOutEmptyStats(co) {
		co.tname = "";
		co.tnumber = 0;

		co.score = 0;
		co.win = 0;
		co.loss = 0;
		co.tie = 0;
		co.games = 0

	}

	function getGroupXML() {
		var groupList;
		groupList = new XMLHttpRequest;
		groupList.open("GET", "/xml:group?id=" + groupID + "&op=tourneys", true);
		groupList.send();

		groupList.onload = function () {

			groupXMLlist = this.responseXML;

			checkHowManyXMLsAreStillNeeded();

		}

	}

	function getTourneyXMLs() {
		tournys.forEach(function (thistourney) {
			var groupList;
			groupList = new XMLHttpRequest;
			groupList.open("GET", "/xml:group?id=" + groupID + "&op=matches&t=" + thistourney.tournamentID, true);
			groupList.send();

			groupList.onload = function () {
				var thisXMLlist = this.responseXML;
				tourneyXMLorder.push(thistourney);
				tourneyXMLlist.push(thisXMLlist);

				checkHowManyXMLsAreStillNeeded();

			}

		});

	}

	


	function findCoach(coachname) {
		var targetCoach;

		DLE.forEach(function (coach) {
			if (coach.coachname == coachname) {
				targetCoach = coach
					return;
			}
		}, targetCoach)

		return targetCoach;
	}

	function divList() {
		var a = [];
		a.push(new divisionObject("KFC North"));
		a.push(new divisionObject("KFC East"));
		a.push(new divisionObject("KFC South"));
		a.push(new divisionObject("KFC West"));

		a.push(new divisionObject("SHC North"));
		a.push(new divisionObject("SHC East"));
		a.push(new divisionObject("SHC South"));
		a.push(new divisionObject("SHC West"));
		return a;
	}

	function confList() {
		var a = [];
		a.push(new confObject("KFC"));
		a.push(new confObject("SHC"));
		return a;

	}

	function confObject(confer) {
		this.name = confer;
		this.coaches = [];
		this.top = [];
		this.bottom = [];
		this.firsts=[];
		this.scorefirst=[];
		this.scorelast=[];

		if (confer==="KFC"){
		this.divisons = [divs[0],divs[1],divs[2],divs[3]]
		this.north=divs[0];
		this.east=divs[1];
		this.south=divs[2];
		this.west=divs[3];
		}else if (confer==="SHC"){
		this.divisions = [divs[4],divs[5],divs[6],divs[7]];
		this.north=divs[4];
		this.east=divs[5];
		this.south=divs[6];
		this.west=divs[7];

		}


		this.coach1 = "";
		this.coach2 = "";
		this.coach3 = "";
		this.coach4 = "";

		this.coach5 = "";
		this.coach6 = "";
		this.coach7 = "";
		this.coach8 = "";
		this.coach9 = "";
		this.coach10 = "";
		this.coach11 = "";
		this.coach12 = "";
		this.coach13 = "";
		this.coach14 = "";
		this.coach15 = "";
		this.coach16 = "";

		}

	function tourneyObject(tournamentID, seasonpart) {
		this.name = "Draft League Europe"
			this.groupID = groupID;
		this.tournamentID = tournamentID;


		this.matches = [];

		this.coaches = [];
		this.divisions = "";
		this.part = seasonpart;

	}

	function divisionObject(divisionName) {
		this.division = divisionName;
		this.coaches = [];
		this.coachesbyscore = [];

		this.coach1 = "";
		this.coach2 = "";
		this.coach3 = "";
		this.coach4 = "";

		this.conference = divisionName.slice(0, 3);
		this.direction = divisionName.slice(4);

		this.tournament1 = 0;
		this.tournament2 = 0;
		this.tournament1name = "";
		this.tournament2name = "";

	}

	function brokenInput(coach, teamname, teamID) {
		coach.teamname = teamname;
		coach.teamID = teamID;

	}

	function tieingObject(coach1, coach2) {}

	function coachObject(teamsegment, divisionName, logo, teamIDsync) {
		var thisCoach = this;

		this.leaguename = "Draft League Europe";
		this.groupID = groupID;
		this.teamsegment = teamsegment
			this.allCoaches = [];
		this.allTeams = [];

		this.coachname = "";
		this.logo = "";
		if (logo)
			this.logo = logo;

		this.t1 = {};
		this.t2 = {};

		fillOutEmptyStats(this.t1); //x.1 tournament of the season
		fillOutEmptyStats(this.t2); //x.2 tournament of the season

		this.conference = divisionName.slice(0, 3);

		this.direction = divisionName.slice(4);

		this.teamname = "notset";
		this.teamID = [];
		this.teamURL = "";
		if (teamIDsync)
			this.teamID.push(teamIDsync);

		this.score = 0;
		this.games = 0;
		this.winpercentage = 0;
		this.TD = 0;
		this.TDagainst = 0;
		this.TDdif = 0;
		this.CASdif=0;
		this.confTDdif=0;
		this.confCASdif=0;

		this.TDandCAS = 0;
		this.TDandCASdif = 0;

		this.win = 0;
		this.loss = 0;
		this.tie = 0;

		this.divisionname = divisionName;
		this.divopponents = [];
		this.divopponent1 = "nobody assigned";
		this.divopponent2 = "nobody assigned";
		this.divopponent3 = "nobody assigned";
		this.divtiebreak = "";

		this.divscore = 0;
		this.divgames = 0;
		this.divwins = 0;
		this.divtie = 0;
		this.divloss = 0;
		this.divpercentage = 0;
		this.divdisplayPercentage = ".000";
		this.divisionfirst = false;

		this.confscore = 0;
		this.confgames = 0;
		this.confwins = 0;
		this.conftie = 0;
		this.confloss = 0;
		this.confpercentage = 0;
		this.confdisplayPercentage = ".000";

		this.confTD = 0;
		this.confTDagainst = 0;
		this.confTDandCAS = 0;
		this.confTDandCASdif = 0;

		this.played = [];
		this.wasbeatingame1 = [];
		this.wasbeatingame2 = [];
		this.wasbeat = [];
		this.beat = [];
		this.beatingame1 = [];
		this.beatingame2 = [];
		this.playedtwice = [];

		this.opponentwins = 0;
		this.opponentties = 0;
		this.opponentloss = 0;
		this.opponentgames = 0;
		this.opponentscore = 0;

		this.opponentperc = 0;
		this.opponentP = ".000";

		this.beatenscored = 0;
		this.beatengames = 0;
		this.beatenwins = 0;
		this.beatenties = 0;
		this.beatenloss = 0;

		this.beatenperc = 0;
		this.beatenP = ".000";

		this.tiebreaker = "";
		this.conbreaker = "";
		this.lockedinat = 2000;
		this.scoredivtiebreak = "";
		this.scorefirst = false;

		this.draftscore = 0;
		this.draftdivscore = 0;
		this.draftconfscore=0;

		this.concessions = 0;
		this.divconcessions = 0;
		this.confconcessions = 0;

		this.scoretie = "Cointoss Needed";
		this.bvalue = 2000;

		this.generateTieprop = function (tiename) {
			var baseProp = thisCoach[tiename];
			baseProp = {};

		}
	}

	function startTimerForUpdate(time) {

		window.setTimeout(function () {
			updateNumbers();
		}, time);

	}

	function proceedUpdatingGrouplister() {

		document.querySelector("input[value='Update note']").click()
	}

	function updateNumbers() {

		document.querySelector("a[href='/p/notes?op=edit&id=4994']").click();

	}

	function calculateTotals(){
	totalTW=0;
	totalGames=0;
	averageTW = 0;
	ofTW85= 0;
		DLE.forEach(function(coach){
		totalTW=totalTW+parseInt(coach.tw);
		totalGames+=parseInt(coach.games)
		console.log("coachTW: "+coach.tw)
		})

		averageTW=Math.floor(totalTW/32);
		ofTW90= Math.floor(totalTW/32*0.90);
        ofTW85=Math.floor(totalTW/32*0.85)


	}

	function updateTables() {
		var wR = "";
		var dat = new Date();
		dat = dat.toString().substring(0, 25);

		wri(writeArea, ""); //clear out any text

		wR += "[block] [/block]";
		wR += "[block=floatright fg=#7a4][size=8]Last Updated: " + dat + " CEST[/size][/block]"
		wR += "[block] [/block]";

		wr(wR);

		wr(generateDivisionTables("winningsort"));

		wr(secondTable());
		sortLeague();
		wr(draftTable());

		sortByScore();
	confSortByScore();
		wr(generateScoreDivTables("percsort"))




		wr(secondscoreTable());

		sortLeagueByScore();
		wr(draftScoreTable());

		wr(endingNotes());

	}

	function concessionPenalty() {}

	function generateLeagueTable() {
		var tableHeaders;
		var thColor = "red";
		var fgColor = "white";
		var backgroundCol = "#e6ddc7"
			var th = 17;

		var oppotools = "";
		var beattools = "";
		var hostiles = "";
		var defeats = "";
		var fullcount = 0;
		var wR = "";
		var winimage = "/i/496166";

		if (div.conference == "SHC") {
			thColor = "blue";
			fgColor = "white";
			winimage = "/i/496217";
		}

		wR += "[block id=Divisions group=basic][toggle=image group=basic block=conference label=Conferences src=/i/495549] [img]/i/495553[/img]";
		wR += "[table=center width=100%]";
		wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]Logo[/th][th bg=" + thColor + "]#[/th][th bg=" + thColor + "] Coach[/th][th bg=" + thColor + "][url=/p/group?op=view&group=10068&p=tournaments fg=white]" + div.division + " Team[/url][/th][th bg=" + thColor + "]TV[/th][th bg=" + thColor + "][toggle=image label=W block=" + sortingMethod + " group=winswitch src=" + winimage + "][/th][th bg=" + thColor + "]T[/th][th bg=" + thColor + "]L[/th][th bg=" + thColor + "]Pct[/th][th bg=" + thColor + "]Div[/th][th bg=" + thColor + "]Pct[/th][th bg=" + thColor + "]Conf[/th][th bg=" + thColor + "]Pct[/th][th bg=" + thColor + "][block tooltip=oppo]Oppo[/block][/th][th bg=" + thColor + "][block tooltip=ctd]C&TD[/block][/th][th bg=" + thColor + " ][block tooltip=cctd]CCTD[/block][/th][th bg=" + thColor + "][block tooltip=tiebreak]Tie Break[/block][/th][/tr]";

		league.coaches.forEach(function (coach, coachdex) {
			var cheesecake = "white";
			if (coachdex % 2 == 1) {
				cheesecake = "#fefefe";

			}

			if (coachdex == 0) {

				if (conferences[0].coaches[0] == coach || conferences[1].coaches[0] == coach || conferences[0].coaches[1] == coach || conferences[1].coaches[1] == coach) {

					cheesecake = "#ffff44";
					//cheesecake = "#CFB53B";

				} else
					cheesecake = "#ada";
				//	cheesecake ="#E6E8FA";

			}

			if (conferences[0].coaches[4] == coach || conferences[1].coaches[4] == coach) {
				cheesecake = "#9ce";

				//cheesecake =	"#8C7853";
			}
			if (conferences[0].coaches[5] == coach || conferences[1].coaches[5] == coach) {
				//	cheesecake = "#bee";
				//	cheesecake = "#7C6843";
				//cheesecake = "#ffff44"
				cheesecake = "#adf";
			}
			hostiles = "";
			defeats = "";
			fullcount++;
			coach.beat.forEach(function (hostile) {
				hostiles += "[block]" + hostile.coachname + "[/block]";
			})

			coach.wasbeat.forEach(function (defeat) {
				defeats += "[block]" + defeat.coachname + "[/block]";
			})

			var addconcessiontext = "";
			var s = "";
			if (coach.concessions > 0) {
				if (coach.concessions !== 1) {
					s = "s";
				}
				addconcessiontext = "[block]Coach received a score penalty for " + coach.concessions + " concession" + s + ".[/block]";

			}

			wR += "[tr bg=" + cheesecake + "]";
			wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
			wR += "[td]" + (coachdex + 1) + ".[/td]";
			wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
			wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
			wR += "[td]" + coach.tv + "[/td]";
			wR += "[td][block tooltip=coachbeats" + fullcount + "]" + coach.win + "[/block][/td]";
			oppotools += "[block=tooltip id=coachbeats" + fullcount + "]" + coach.coachname + " has already beaten:" + hostiles + "[/block]";
			beattools += "[block=tooltip id=coachdefeats" + fullcount + "]" + coach.coachname + " was already beaten by:" + defeats + addconcessiontext + "[/block]"
			wR += "[td]" + coach.tie + "[/td]";
			wR += "[td][block tooltip=coachdefeats" + fullcount + "]" + coach.loss + "[/block][/td]";
			wR += "[td]" + percToString(coach.draftwinpercentage) + "[/td]";
			wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
			wR += "[td]" + percToString(coach.draftdivpercentage) + "[/td]";
			wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
			wR += "[td]" + percToString(coach.draftconfpercentage)+ "[/td]";
			wR += "[td]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss + "[/td]";
			wR += "[td]" + coach.TDandCASdif + "[/td]";
			wR += "[td]" + coach.confTDandCASdif + "[/td]";
			wR += "[td]" + coach.tiebreaker + "[/td]";
			wR += "[/tr]";
			//[block=hidden COMMENT]HERE IS WHERE THE CODE FOR DIVISION "+div.division.toUpperCase()+" ENDS!![/block]

		});
		wR += "[tr][[td colspan=" + th + " bg=red][/td][/tr]";
		wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][block=hidden COMMENT]HERE IS WHERE THE CODE FOR LEAGUE TABLE ENDS!! COPY FROM DIVISION START EVERTYTHING UP TO /TR JUST AFTER THIS BLOCK AND THEN ADD BBCODE FOR {/table} TABLE WITH CORRECT BRACKETS AT THE END [/block][/td][/tr]"
		wR += "[/table][/block][/block]";

	}
	function checkTieBreaker(coaches, propertyarray) {
		coaches.forEach(tiebreak);
		function tiebreak(a, index) {
			b = (coaches[index + 1] || 0);
			if (b == 0)
				return;
			propertyarray.forEach(breakorder);
			function breakorder(breaker) {
				if (a[breaker] !== b[breaker]) {}

			}

		}

	}

	function generateScoreDivTables(sortingMethod) {
		var tableHeaders;
		var thColor = "red";
		var fgColor = "white";
		var backgroundCol = "#e6ddc7"
			var th = 17;
		var differer = "";
		if (sortingMethod == "percsort")
			differer = "2";

		var oppotools = "";
		var beattools = "";
		var hostiles = "";

		var defeats = "";

		var divhostiles = "";
		var divdefeats = "";
		var fullcount = 0;
		var wR = "";
		var winimage = "https://fumbbl.com/i/496166";

		wR += "[block=hidden id=scorediv group=basic][toggle=image group=basic block=leaguescore label=League src=/i/501699][toggle=image group=basic block=scoreconference label=Conferences src=/i/495549] [img]/i/495553[/img]";

		wR += "[table=center width=100%]";

		divs.forEach(function (div) {
			if (div.conference == "SHC") {
				thColor = "blue";
				fgColor = "white";
				winimage = "https://fumbbl.com/i/496217";
			}
			//[block=hidden COMMENT] THIS IS A BB-CODE COMMENT TO SHOW YOU WHERE YOUR DIVISION CODE IS. THE DIVISION FOR THIS PIECE OF CODE IS "+div.division.toUpperCase()+" START COPY&PASTING AT [bb-code][th][/bbcode] BUT YOU NEED TO ADD TABLE AND TR BRACKETS AT THE START AND END OF EVERYTHING[bb-code][table][tr][th bg="+thColor+"] copy&paste [/td][/tr][/table][/bbcode][/block]
			wR += "[tr bg=" + backgroundCol + "][td colspan=" + th + "][block=hidden COMMENT] THIS IS A BB-CODE COMMENT TO SHOW YOU WHERE YOUR DIVISION CODE IS. THE DIVISION FOR THIS PIECE OF CODE IS " + div.division.toUpperCase() + " START COPY&PASTING RIGHT FROM THE NEXT {TR} BUT WITH CORRECT BRACKETS. THEN YOU NEED TO ADD {table} BRACKETS AT BEGINNING.[/block][/td][/tr]";
			wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]Logo[/th][th bg=" + thColor + "]#[/th][th bg=" + thColor + "] Coach[/th][th bg=" + thColor + "][url=/p/group?op=view&group=10068&p=tournaments fg=white]" + div.division + " Team[/url][/th][th bg=" + thColor + "][toggle=image label=W block=divisions group=basic src=" + winimage + "][/th][th bg=" + thColor + "]T[/th][th bg=" + thColor + "]L[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Div[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Conf[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + " ][block tooltip=beat]Beaten[/block][/th][th bg=" + thColor + "][block tooltip=oppo]Oppo[/block][/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "][block tooltip=ctd]C&TD[/block][/th][th bg=" + thColor + " ][block tooltip=cctd]CCTD[/block][/th][th bg=" + thColor + "][block tooltip=tiebreak]Tie Break[/block][/th][/tr]";
			div.coachesbyscore.forEach(function (coach, coachdex) {
				var cheesecake = "white";
				if (coachdex % 2 == 1) {
					cheesecake = "#fefefe";

				}

				if (coachdex == 0) {

					if (conferences[0].scorecoaches[0] == coach || conferences[1].scorecoaches[0] == coach || conferences[0].scorecoaches[1] == coach || conferences[1].scorecoaches[1] == coach) {

						cheesecake = "#ffff44";
						//cheesecake = "#CFB53B";

					} else
						cheesecake = "#ada";
					//	cheesecake ="#E6E8FA";

				}

				if (conferences[0].scorecoaches[4] == coach || conferences[1].scorecoaches[4] == coach) {
					cheesecake = "#9ce";

					//cheesecake =	"#8C7853";
				}
				if (conferences[0].scorecoaches[5] == coach || conferences[1].scorecoaches[5] == coach) {
					//	cheesecake = "#bee";
					//	cheesecake = "#7C6843";
					//cheesecake = "#ffff44"
					cheesecake = "#adf";
				}
				hostiles = "";
				defeats = "";
				fullcount++;
				coach.beat.forEach(function (hostile) {
					hostiles += "[block]" + hostile.coachname + "[/block]";
				})

				coach.wasbeat.forEach(function (defeat) {
					defeats += "[block]" + defeat.coachname + "[/block]";
				})

				coach.beatingame1.forEach(function (divhostile) {
					divhostiles += "[block]" + divhostile.coachname + "[/block]";

				})

				coach.wasbeatingame1.forEach(function (divdefeat) {
					divdefeats += "[block]" + divdefeat.coachname + "[/block]";

				})

				var addconcessiontext = "";
				var s = "";
				if (coach.concessions > 0) {
					if (coach.concessions !== 1) {
						s = "s";
					}
					addconcessiontext = "[block]Coach received a score penalty for " + coach.concessions + " concession" + s + ".[/block]";

				}

				wR += "[tr bg=" + cheesecake + "]";
				wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
				wR += "[td]" + (coachdex + 1) + ".[/td]";
				wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
				wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
				wR += "[td][block tooltip=coachbeats" + coach.fullcount + "]" + coach.win + "[/block][/td]";
				oppotools += "[block=tooltip id=coachbeats" + coach.fullcount + "]" + coach.coachname + " has already beaten:" + hostiles + "[/block]";
				beattools += "[block=tooltip id=coachdefeats" + coach.fullcount + "]" + coach.coachname + " was already beaten by:" + defeats + addconcessiontext + "[/block]"
				wR += "[td]" + coach.tie + "[/td]";
				wR += "[td][block tooltip=coachdefeats" + coach.fullcount + "]" + coach.loss + "[/block][/td]";
				wR += "[td]" + coach.score + "[/td]";
				wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
				wR += "[td]" + coach.divscore + "[/td]";
				wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
				wR += "[td]" + coach.confscore + "[/td]";
				wR += "[td]" + coach.beatenwins + "-" + coach.beatenties + "-" + coach.beatenloss + "[/td]";
				wR += "[td]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss + "[/td]";
				wR += "[td]" + coach.opponentscore + "[/td]";
				wR += "[td]" + coach.TDandCASdif + "[/td]";
				wR += "[td]" + coach.confTDandCASdif + "[/td]";
				wR += "[td]" + filterPropertyMessage(coach.scoredivtiebreak) +coach.scoredivtieheight+"[/td]";
				wR += "[/tr]";
				//[block=hidden COMMENT]HERE IS WHERE THE CODE FOR DIVISION "+div.division.toUpperCase()+" ENDS!![/block]

			});
			wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][block=hidden COMMENT]HERE IS WHERE THE CODE FOR DIVISION " + div.division.toUpperCase() + " ENDS!! COPY FROM DIVISION START EVERTYTHING UP TO /TR JUST AFTER THIS BLOCK AND THEN ADD BBCODE FOR {/table} TABLE WITH CORRECT BRACKETS AT THE END [/block][/td][/tr]"
		});
		wR += "[/table][/block][/block]";
		wR += oppotools;
		wR += beattools;

		return wR;
	}

	function generateDivisionTables(sortingMethod) {
		var tableHeaders;
		var thColor = "red";
		var fgColor = "white";
		var backgroundCol = "#e6ddc7"
			var th = 17;
		var differer = "";
		if (sortingMethod == "percsort")
			differer = "2";

		var oppotools = "";
		var beattools = "";
		var hostiles = "";
		var opperc = "";
		var defeats = "";
		var opperctool = "";
		var divhostiles = "";
		var divdefeats = "";
		var beaterperc = "";


		var wH = ""; //header
		var wR = ""; //text
		var wAll;

		var winimage = "https://fumbbl.com/i/496166";

		wR += "[block id=divisions group=basic][toggle=image group=basic block=league label=League src=/i/501699][toggle=image group=basic block=conference label=Conferences src=/i/495549] [img]/i/495553[/img]";

		wR += "[table=center width=100%]";

		divs.forEach(function (div) {
			if (div.conference == "SHC") {
				thColor = "blue";
				fgColor = "white";
				winimage = "https://fumbbl.com/i/496217";
			}
			//[block=hidden COMMENT] THIS IS A BB-CODE COMMENT TO SHOW YOU WHERE YOUR DIVISION CODE IS. THE DIVISION FOR THIS PIECE OF CODE IS "+div.division.toUpperCase()+" START COPY&PASTING AT [bb-code][th][/bbcode] BUT YOU NEED TO ADD TABLE AND TR BRACKETS AT THE START AND END OF EVERYTHING[bb-code][table][tr][th bg="+thColor+"] copy&paste [/td][/tr][/table][/bbcode][/block]
			wR += "[tr bg=" + backgroundCol + "][td colspan=" + th + "][block=hidden COMMENT] THIS IS A BB-CODE COMMENT TO SHOW YOU WHERE YOUR DIVISION CODE IS. THE DIVISION FOR THIS PIECE OF CODE IS " + div.division.toUpperCase() + " START COPY&PASTING RIGHT FROM THE NEXT {TR} BUT WITH CORRECT BRACKETS. THEN YOU NEED TO ADD {table} BRACKETS AT BEGINNING.[/block][/td][/tr]";

			wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]Logo[/th]";
			wR += "[th bg=" + thColor + "]#[/th]";
			wR += "[th bg=" + thColor + "] Coach[/th]";
			wR += "[th bg=" + thColor + "][url=/p/group?op=view&group=10068&p=tournaments fg=white]" + div.division + " Team[/url][/th]";
			wR += "[th bg=" + thColor + "]Games [/th]";
			wR += "[th bg=" + thColor + "][block tooltip=sortbyscor][toggle=image label=W block=scorediv group=basic src=" + winimage + "][/block][/th]";
			wR += "[th bg=" + thColor + "]T[/th]";
			wR += "[th bg=" + thColor + "]L[/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + "]Div[/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + "]Conf[/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + " ][block tooltip=beat]Beaten[/block][/th]";
			wR += "[th bg=" + thColor + "][block tooltip=oppo]Oppo[/block][/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + "][block tooltip=ctd]C&TD[/block][/th]";
			wR += "[th bg=" + thColor + " ][block tooltip=cctd]CCTD[/block][/th]";
			wR += "[th bg=" + thColor + "][block tooltip=tiebreak]Tie Break[/block][/th]";
			wR += "[/tr]";

			div.coaches.forEach(function (coach, coachdex) {
				coach.fullcount = fullcount;

				var cheesecake = "white";
				if (coachdex % 2 == 1) {
					cheesecake = "#fefefe";

				}

				if (coachdex == 0) {

					if (conferences[0].coaches[0] == coach || conferences[1].coaches[0] == coach || conferences[0].coaches[1] == coach || conferences[1].coaches[1] == coach) {

						cheesecake = "#ffff44";
						//cheesecake = "#CFB53B";

					} else
						cheesecake = "#ada";
					//	cheesecake ="#E6E8FA";

				}

				if (conferences[0].coaches[4] == coach || conferences[1].coaches[4] == coach) {
					cheesecake = "#9ce";

					//cheesecake =	"#8C7853";
				}
				if (conferences[0].coaches[5] == coach || conferences[1].coaches[5] == coach) {
					//	cheesecake = "#bee";
					//	cheesecake = "#7C6843";
					//cheesecake = "#ffff44"
					cheesecake = "#adf";
				}
				var hostiles = "";
				var defeats = "";
				divhostiles = "";
				divdefeats = "";
				var tempcount = false;
				var tempcount2 = false;

				fullcount++;

				coach.fullcount = fullcount;
				coach.beat.forEach(function (hostile) {
					hostiles += "[block]" + hostile.coachname + "[/block]";
				})

				coach.wasbeat.forEach(function (defeat) {
					defeats += "[block]" + defeat.coachname + "[/block]";
				})

				coach.beatingame1.forEach(function (divhostile) {
					if (coach.playedtwice.indexOf(divhostile) == -1) {
						if (tempcount === false) {
							divhostiles += "[block][/block]-[block]Did Momentarily Beat (Outstanding Games Still Coming):[/block]";

						}
						tempcount = true;

						divhostiles += "[block fg=green]" + divhostile.coachname + "[/block]";
					}
				})

				coach.wasbeatingame1.forEach(function (divdefeat) {

					if (coach.playedtwice.indexOf(divdefeat) == -1) {
						if (tempcount2 === false) {
							divdefeats += "[block][/block]-[block]Momentarily Beaten By(Outstanding Games Still Coming):[/block]";

						}
						tempcount2 = true;
						divdefeats += "[block fg=red]" + divdefeat.coachname + "[/block]";

					}
				})

				var addconcessiontext = "";
				var s = "";
				if (coach.concessions > 0) {
					if (coach.concessions !== 1) {
						s = "s";
					}

				}

				wR += "[tr bg=" + cheesecake + "]";
				wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
				wR += "[td]" + (coachdex + 1) + ".[/td]";
				wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
				wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
				wR += "[td]" + coach.games + "[/td]";
				wR += "[td][block tooltip=coachbeats" + fullcount + "]" + coach.win + "[/block][/td]";
				wR += "[td]" + coach.tie + "[/td]";
				wR += "[td][block tooltip=coachdefeats" + fullcount + "]" + coach.loss + "[/block][/td]";
				wR += "[td]" + coach.displayPercentage + "[/td]";
				wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
				wR += "[td]" + coach.divdisplayPercentage + "[/td]";
				wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
				wR += "[td]" + coach.confdisplayPercentage + "[/td]";
				wR += "[td][block tooltip=beaterperc" + fullcount + "]" + coach.beatenwins + "-" + coach.beatenties + "-" + coach.beatenloss + "[/td]";
				wR += "[td]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss +"[/td]";
				wR += "[td]" + coach.opponentP + "[/td]";
				wR += "[td]" + coach.TDandCASdif + "[/td]";
				wR += "[td]" + coach.confTDandCASdif + "[/td]";
				wR += "[td]" + filterPropertyMessage(coach.divtiebreak) + "[/td]";
				wR += "[/tr]";
				//[block=hidden COMMENT]HERE IS WHERE THE CODE FOR DIVISION "+div.division.toUpperCase()+" ENDS!![/block]

				oppotools += "[block=tooltip id=coachbeats" + fullcount + "]" + coach.coachname + " has already beaten:" + hostiles + divhostiles + "[/block]";
				beattools += "[block=tooltip id=coachdefeats" + fullcount + "]" + coach.coachname + " was already beaten by:" + defeats + divdefeats + addconcessiontext + "[/block]"
				opperctool += "[block=tooltip id=opperc" + fullcount + "]Oppenent Percentage:" + coach.opponentP + "[/block]";
				beaterperc += "[block=tooltip id=beaterperc" + fullcount + "]Beaten Percentage:" + coach.beatenP + "[/block]";

			});
			wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][block=hidden COMMENT]HERE IS WHERE THE CODE FOR DIVISION " + div.division.toUpperCase() + " ENDS!! COPY FROM DIVISION START EVERTYTHING UP TO /TR JUST AFTER THIS BLOCK AND THEN ADD BBCODE FOR {/table} TABLE WITH CORRECT BRACKETS AT THE END [/block][/td][/tr]"

		});
		wR += "[/table][/block][/block]";
		wR += oppotools;
		wR += beattools;
		wR += opperctool;
		wR += beaterperc;

		return wR;
	}

	function readOutCoachesFromArray(targetArray) {
		var readOut = "";
		targetArray.forEach(function (instance) {
			readOut += "[block]" + instance.coachname + "[/block]";

		});

		return readOut;
	}

	function readOutArray(targetArray, relevantProperty) {
		relevantProperty = relevantProperty || "coachname";

		var readOut = "";
		targetArray.forEach(function (instance) {
			readOut += "[block]" + instance[relevantProperty] + "[/block]";

		});

		return readOut;
	}

	function endingNotes() {
		var endingNotes = "";

		endingNotes += "[size=8][block=floatright bg=purple fg=orange ][url=https://fumbbl.com/p/team?team_id=835952 fg=orange] Flashfurt Universe[/url].[/block][block=floatright]This chart was brought to you by [/block][/size]"
		endingNotes += "[block bg=black fg=white width=41%][block]Color Names and Meaning: [/block]"
		endingNotes += "[block] [/block]"
		endingNotes += "[block fg=#ffff44]Gorse Yellow: Division First & First or Second in Conference[/block]"
		endingNotes += "[block fg=#ada]Spring Rain Green: Division First & Third or Fourth in Conference.[/block]"
		endingNotes += "[block fg=#9ce]Regend Saint Blue: Wild Card 5th[/block]"
		endingNotes += "[block fg=#adf]Perano Blue: Wild Card 6th[/block]"
		endingNotes += "[block] [/block][/block]"
		endingNotes += "[block] [/block]"
		endingNotes += "[block bg=#efe][block]Division Score is based on:[/block]"
		endingNotes += "[block] [/block]"
		endingNotes += "[block]Win-Tie-Loss-Percentage - Ties are considered as half a win and half a loss.[/block]"
		endingNotes += "[block]Head To Head Comparison - For more than 2 coaches one has to have beat all other coaches or be beat by all other coaches in Head To Head. For two coaches from the same division none is considered to have beat the other before both their encounters have been played out. (A win and tie is minimum to consider one have beat the other.)[/block]"
		endingNotes += "[block]Division Percentage - Considers only games within the Division. Is ignored when cross-division teams are on the same tie breaker.[/block]"
		endingNotes += "[block]Conference Percentage - Considers only games within the Conference.[/block]"
		endingNotes += "[block]Opponent Percentage - Considers the records of all the coaches a coach has played against.[/block]"
		endingNotes += "[block]TDandCASdif - Compares straight up the added amount of Cas and TD for and against.[/block]";
		endingNotes += "[block]Conference TDandCASdif - Compares straight up the added amount of Cas and TD for and against only in Conference.[/block]";
		endingNotes += "[block]Cointoss Needed - Indicates to a groupmanager he will have to perform a cointoss at the end of the season.[/block][/block]";
		endingNotes += "[block][/block]"
		endingNotes += "[block]Note: Due to the complexity of the code, it is possible that more complex situations particularly involving more than 2 coaches on a tie breaker could get handled incorrrectly. Every coach is encouraged to back check the correctness of his data if he feels something is incorrect. Head to head tie breaker is based on an entirely unique sorting function and remains entirely untested due to lack of cases where it matters. Note that inner division games will not consider Head To Head until the second half of the season when both games against the same coach have been played.[/block]"
		endingNotes += "[block=tooltip id=tiebreak]Detailed description at the bottom of the list.[/block][block=tooltip id=cctd]Sum of casualty and touchdown differences within conference.[/block][block=tooltip id=ctd]Sum of overall casualty and touchdown differences.[/block][block=tooltip id=beat]Combined Win-Tie-Loss Record of all teams beaten. Currently not a tie breaker.[/block][block=tooltip id=oppo]Combined Win-Tie-Loss Record of all teams played.[/block]";
		endingNotes += "[block=tooltip id=sortbyscor]Press button to sort tables by scores.[/block]";

		return endingNotes;
	}

	function wonGamesTable() {

		return "";
	}

	function tieObject(breaker, bValue) {
		this.breaker = breaker;
		this.bvalue = bValue;
		this.coachlist = [];

	}

	function tieProper() {
		var duce = [];
		duce.hasValue = function () {
			hasValue(duce);
		}
		return duce;
	}

	function tiedTo(coachname, tiebreakname, tievalue) {
		this.counter = function (current) {
			var i = (current + 1 || 0);
			return i;
		}
		this.tiedTo = coachname;
		this.breaker = tiebreakname;
		this.tievalue = tievalue;

		this.count = this.counter(this.count);

	}

	function sortProp(targetArray, targetProp, scoretie, tiebreakname) {
		var smallArray = [];

		targetArray.forEach(function (fromList) {
			var oldTieBreak;
			fromList.coaches.sort(function (a, b) {

				if (a[targetProp] === b[targetProp]) {
					if (a.oldtiebreak) {
						a[scoretie] = a.oldtiebreak;
						b[scoretie] = b.oldtiebreak;
					}

				}

				if (a[targetProp] !== b[targetProp]) {

					a.oldtiebreak = tiebreakname;
					b.oldtiebreak = tiebreakname;

				}

				return b[targetProp] - a[targetProp];

			});

		});

	}

	function divSortProp(targetProp, tiebreakname) {
		sortProp(divs, targetProp, "scoretie", tiebreakname)
	}

	function checkForTies(targetArray, targetProp) {

		targetArray.forEach(function (fromList) {
			var oldTieBreak;
			fromList.coaches.forEach(function (a, index) {

				var b = coaches[index + 1] || 0;
				if (b === 0)
					return;

				if (a[targetProp] === b[targetProp]) {
					a["TiedTo"] = (a["TiedTo"] || {});
					b["TiedTo"] = (b["TiedTo"] || {});
					var t2 = a["TiedTo"];
					var t3 = b["TiedTo"];
					t2[b.coachname] = (t2[b.coachname] || {});
					t3[a.coachname] = (t2[a.coachname] || {});

					t2[b.coachname].tie = tiebreakername;
					t2[b.coachname].counter = (at2[b.coachname].counter + 1 || 0);

					t3[a.coachname].tie = tiebreakername;
					t3[a.coachname].counter = (at2[a.coachname].counter + 1 || 0);

				}

				if (a[targetProp] !== b[targetProp]) {
					if (a["TiedTo"] == b && b["TiedTo"] == a) {
						a["TiedTo"] = undefined;
						b["TiedTo"] = undefined;
						oldTieBreak = a[scoretie];
					}
					a[scoretie] = tiebreakname;
					b[scoretie] = tiebreakname;
					if (tiebreakname === oldTieBreak) {
						a[scoretie] = oldTieBreak;
					}
				}

			});
		});
	}

	function sortLeague() {
	var tempCoaches = [];
	tempCoaches = DLE.slice(0);
	var sortList = ["draftwinpercentage","head2head", "opponentperc","TDdif", "CASdif","confTDdif", "confCASdif"];
	var verytop = [];
	var restverytop=[];
	var top = [];
	var bottom = [];
	var placeholder = [];
	conferences.forEach(function (conf){
	conf.coaches.forEach(function (coach,index){
			if (!coach.draftdisplayPercentage ){
			coach.draftwinpercentage = coach.winpercentage;
			coach.draftdisplayPercentage = coach.displayPercentage;

			}
			if (!coach.draftdivdisplayPercentage){
				coach.draftdivpercentage = coach.divpercentage;
				 coach.draftdivdisplayPercentage= coach.divdisplayPercentage
			}
			if (!coach.draftconfdisplayPercentage){

				coach.draftconfpercentage = coach.confpercentage;
				coach.draftconfdisplayPercentage = coach.confdisplayPercentage;
			}

	if (index<2) {
		verytop.push(coach);
	} else 	if (index<4) {
		restverytop.push(coach);

	} else 	if (index<6) {
		top.push(coach);

	}	else {

		bottom.push(coach);
	}


	})
	})
	DLE = [];
	var ph =[];
	verytop = sorterScript(verytop, "league", sortList, 0);
	restverytop = sorterScript(restverytop, "league", sortList, 0);
	top = sorterScript(top, "league", sortList, 0);
 	bottom = sorterScript(bottom, "league", sortList, 0);

	ph= verytop.concat(restverytop);
	placeholder = ph.concat(top);
	DLE = placeholder.concat(bottom);
	}


	function sortLeagueByScore() {
	var tempCoaches = [];
	tempCoaches = DLE.slice(0);
	var sortList = ["draftscore","head2head", "opponentscore","TDdif","CASdif","confTDdif"];
	var verytop = [];
	var top = [];
	var bottom = [];
	var placeholder = [];
	var restverytop=[];
	conferences.forEach(function (conf){
	conf.coaches.forEach(function (coach,index){
			if (!coach.draftscore ){
			coach.draftscore = coach.score;
			}
			if (!coach.draftconfscore ){
			coach.draftconfscore = coach.confscore;
			}
				if (!coach.draftdivscore){
			coach.draftdivscore = coach.divscore;
			}


	if (index<2) {
		verytop.push(coach);
	} else 	if (index<4) {
		restverytop.push(coach);

	} else 	if (index<6) {
		top.push(coach);

	} else {

		bottom.push(coach);
	}


	})
	})
	DLE = [];
	var ph=[];
	verytop = sorterScript(verytop, "leaguescore", sortList, 0);
	restverytop = sorterScript(restverytop, "leaguescore", sortList, 0);
	top = sorterScript(top, "leaguescore", sortList, 0);
 	bottom = sorterScript(bottom, "leaguescore", sortList, 0);

	ph = verytop.concat(restverytop);
	placeholder = ph.concat(top);
	DLE = placeholder.concat(bottom);
	}

	function sortByScore(){
		var scoreDivSort = ["score","head2head","divscore","confscore","opponentscore","TDandCASdif","confTDandCASdif"];

		divs.forEach(function (div){
		var tempclist = div.coaches.splice(0);
		div.coachesbyscore = sorterScript(tempclist, "scorediv", scoreDivSort, 0).splice(0);
		div.coachesbyscore[0].scorefirst = true;
		div.conf.scorefirst.push(div.coachesbyscore[0]);




		});


	}

	function confSortByScore(){
	var confSort= ["score","head2head","confscore","opponentscore","TDandCASdif","confTDandCASdif"];


	conferences.forEach(function (conf){
	conf.coaches.forEach(function (coach){
	if (coach.scorefirst===false){
	conf.scorelast.push(coach)
	}
	});
	conf.scorefirst = sorterScript(conf.scorefirst, "scoreconf", confSort, 0);
	conf.scorelast = sorterScript(conf.scorelast, "scoreconf", confSort, 0);
	conf.scorecoaches = [];
	conf.scorecoaches = conf.scorefirst.concat(conf.scorelast);
	});



	}



	function draftTable() {
		var wR = "";
		var thColor = "red";
		var fgColor = "white";
		var th = 20;
		var backgroundCol = "#e6ddc7"
		var winimage = "/i/496166";

			wR += "[block=hidden group=basic id=league][img]/i/501702[/img] [toggle=image group=basic block=conference label=Conferences src=/i/495549] [toggle=image group=basic block=divisions label=Divisions src=/i/495573]";
		wR += "[block bg=orange]Disclaimer: This table is sorted based on reverse draft order. Some percentages may display differently than on the other tables because concessions are added to the score rather than subtracted.[/block]"
		wR += "[table width=100%]";
		wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]From[/th][th bg=" + thColor + "]Logo[/th][th bg=" + thColor + "]#[/th][th bg=" + thColor + "] Coach[/th][th bg=" + thColor + "] Team[/th][th bg=" + thColor + "]TW[/th][th bg=" + thColor + "]Games[/th][th bg=" + thColor + "][block tooltip=sortbyscor][toggle=image label=W block=leaguescore group=basic src=" + winimage + "][/block][/th][th bg=" + thColor + "]T[/th][th bg=" + thColor + "]L[/th][th bg=" + thColor + "]Pct[/th][th bg=" + thColor + "]Div[/th][th bg=" + thColor + "]Pct[/th][th bg=" + thColor + "]Conf[/th][th bg=" + thColor + "]Pct[/th][th bg=" + thColor + "]Oppo[/th][th bg=" + thColor + "]PCT[/th][th bg=" + thColor + "]TD[/th][th bg=" + thColor + "]CAS[/th][th bg=" + thColor + "]Tie Break[/th][/tr]";
		DLE.forEach(function (coach, coachdex) {
			var cheesecake = "white";
			if (coachdex % 2 == 1) {
				cheesecake = "#efefef";

			}
			if (coachdex < 12) {
				cheesecake = "lightblue";

			}
				if (coachdex < 8) {
				cheesecake = 	"#7ad";

			}
			if (coachdex < 4) {
				cheesecake = "yellow";

			}



			wR += "[tr bg=" + cheesecake + "]";

			wR += "[td]" + coach.conference + " " + coach.direction + "[/td]";
			wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
			wR += "[td]" + (coachdex + 1) + ".[/td]";
			wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
			wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
	wR += "[td]" + coach.tw + "[/td]";
			wR += "[td]" + coach.games + "[/td]";
			wR += "[td][block tooltip=coachbeats" + coach.fullcount + "]" + coach.win + "[/block][/td]";
			wR += "[td]" + coach.tie + "[/td]";
			wR += "[td][block tooltip=coachdefeats" + coach.fullcount + "]" + coach.loss + "[/block][/td]";
			wR += "[td]" + percToString(coach.draftwinpercentage) + "[/td]";
			wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
			wR += "[td]" + percToString(coach.draftdivpercentage) + "[/td]";
			wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
			wR += "[td]" + percToString(coach.draftconfpercentage)+ "[/td]";

			wR += "[td][block tooltip=opperc" + coach.fullcount + "]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss + "[/block][/td]";
			wR += "[td]" + percToString(coach.opponentperc) + "[/td]";
			wR += "[td]" + coach.TDdif + "[/td]";
			wR += "[td]" + coach.CASdif + "[/td]";
			wR += "[td]" + filterPropertyMessage(coach.leaguetiebreak) + "[/td]";

			wR += "[/tr]";
		});
		wR += "[tr][td colspan=4 bg=red][/td][td bg=red]Average TW: "+Math.floor(averageTW/10)*10+"[/td][td colspan=5 bg=red]Floor TW (85%): "+Math.floor(ofTW85/10)*10+"[/td][td colspan="+(th-10)+" bg=red][/td][/tr]";
		wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][/td][/tr]";

		wR += "[/table][/block][/block]";
		wR += "[/block]";
		return wR;
	}

	function draftScoreTable() {
		var wR = "";
		var thColor = "red";
		var fgColor = "white";
		var th = 19;
		var backgroundCol = "#e6ddc7"
		var winimage = "/i/496166";

			wR += "[block=hidden group=basic id=leaguescore][img]/i/501702[/img] [toggle=image group=basic block=scoreconference label=conference src=/i/495549] [toggle=image group=basic block=scorediv label=Divisions src=/i/495573]";
		wR += "[block bg=orange]Disclaimer: This table is sorted based on reverse draft order. Some percentages may display differently than on the other tables because concessions are added to the score rather than subtracted.[/block]"
		wR += "[table width=100%]";
		wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]From[/th][th bg=" + thColor + "]Logo[/th][th bg=" + thColor + "]#[/th][th bg=" + thColor + "] Coach[/th][th bg=" + thColor + "] Team[/th][th bg=" + thColor + "][block tooltip=sortbyscor][toggle=image label=W block=league group=basic src=" + winimage + "][/block][/th][th bg=" + thColor + "]T[/th][th bg=" + thColor + "]L[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Div[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Conf[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Beaten[/th][th bg=" + thColor + "]Oppo[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]TD[/th][th bg=" + thColor + "]CAS[/th][th bg=" + thColor + "]Tie Break[/th][/tr]";
		DLE.forEach(function (coach, coachdex) {
			var cheesecake = "white";
			if (coachdex % 2 == 1) {
				cheesecake = "#efefef";

			}
			if (coachdex < 12) {
				cheesecake = "lightblue";

			}

			if (coachdex < 8) {
				cheesecake = 	"#7ad";

			}


			if (coachdex < 4) {
				cheesecake = "yellow";

			}



			wR += "[tr bg=" + cheesecake + "]";

			wR += "[td]" + coach.conference + " " + coach.direction + "[/td]";
			wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
			wR += "[td]" + (coachdex + 1) + ".[/td]";
			wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
			wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
			wR += "[td][block tooltip=coachbeats" + coach.fullcount + "]" + coach.win + "[/block][/td]";
				wR += "[td]" + coach.tie + "[/td]";
				wR += "[td][block tooltip=coachdefeats" + coach.fullcount + "]" + coach.loss + "[/block][/td]";
			wR += "[td]" + coach.draftscore + "[/td]";
			wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
			wR += "[td]" + coach.draftdivscore + "[/td]";
			wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
			wR += "[td]" + coach.draftconfscore + "[/td]";
			wR += "[td]" + coach.beatenwins + "-" + coach.beatenties + "-" + coach.beatenloss + "[/td]";
			wR += "[td]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss + "[/td]";
			wR += "[td]" + coach.opponentscore + "[/td]";
			wR += "[td]" + coach.TDdif + "[/td]";
			wR += "[td]" + coach.CASdif + "[/td]";
			wR += "[td]" + filterPropertyMessage(coach.leaguescoretiebreak) +coach.leaguescoretieheight+"[/td]";

			wR += "[/tr]";
		});
		wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][/td][/tr]";

		wR += "[/table][/block][/block]";
		wR += "[/block]";
		return wR;
	}




	function secondTable() {
		var wR = "";
		var thColor = "red";
		var fgColor = "white";
		var th = 20;
		var backgroundCol = "#e6ddc7"
		var winimage = "https://fumbbl.com/i/496166";

			wR += "[block=hidden group=basic id=conference][toggle=image group=basic block=league label=League src=/i/501699][img]/i/495552[/img][toggle=image group=basic block=divisions label=Divisions src=/i/495573]";
		wR += "[table width=100%]";

		conferences.forEach(function (div) {

			if (div.name == "SHC") {
				thColor = "blue";
				fgColor = "white";
				winimage = "/i/496217";
			}

			wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]From[/th]";
			wR += "[th bg=" + thColor + "]Logo[/th]";
			wR += "[th bg=" + thColor + "]#[/th]";
			wR += "[th bg=" + thColor + "] Coach[/th]";
			wR += "[th bg=" + thColor + "][url=/p/group?op=view&group=10068&p=tournaments fg=white]" + div.name + " Team[/url][/th]";
			wR += "[th bg=" + thColor + "]Games [/th]";
			wR += "[th bg=" + thColor + "][block tooltip=sortbyscor][toggle=image label=W block=scoreconference group=basic src=" + winimage + "][/block][/th]";
			wR += "[th bg=" + thColor + "]T[/th]";
			wR += "[th bg=" + thColor + "]L[/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + "]Div[/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + "]Conf[/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + " ][block tooltip=beat]Beaten[/block][/th]";
			wR += "[th bg=" + thColor + "][block tooltip=oppo]Oppo[/block][/th]";
			wR += "[th bg=" + thColor + "]Pct[/th]";
			wR += "[th bg=" + thColor + "][block tooltip=ctd]C&TD[/block][/th]";
			wR += "[th bg=" + thColor + " ][block tooltip=cctd]CCTD[/block][/th]";
			wR += "[th bg=" + thColor + "][block tooltip=tiebreak]Tie Break[/block][/th]";
			wR += "[/tr]";


			div.coaches.forEach(function (coach, coachdex) {
				var cheesecake = "white";
				if (coachdex % 2 == 1) {
					cheesecake = "#efefef";

				}if (coachdex == 0) {
					cheesecake = "#ffff33";

				}if (coachdex == 1) {
					cheesecake = "#ffff00";

				}

				if (coachdex == 2) {
					cheesecake = "#7ad";

				}
				if (coachdex == 3) {
					cheesecake = "#8be";
				}

				if (conferences[0].coaches[4] == coach || conferences[1].coaches[4] == coach) {

					cheesecake = "#add";
				}
				if (conferences[0].coaches[5] == coach || conferences[1].coaches[5] == coach) {
					cheesecake = "#bee";
				}

				wR += "[tr bg=" + cheesecake + "]";

				wR += "[td]" + coach.direction + "[/td]";
				wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
				wR += "[td]" + (coachdex + 1) + ".[/td]";
				wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
				wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
				wR += "[td]" + coach.games + "[/td]";
				wR += "[td][block tooltip=coachbeats" + coach.fullcount + "]" + coach.win + "[/block][/td]";
				wR += "[td]" + coach.tie + "[/td]";
				wR += "[td][block tooltip=coachdefeats" + coach.fullcount + "]" + coach.loss + "[/block][/td]";
				wR += "[td]" + coach.displayPercentage + "[/td]";
				wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
				wR += "[td]" + coach.divdisplayPercentage + "[/td]";
				wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
				wR += "[td]" + coach.confdisplayPercentage + "[/td]";
				wR += "[td][block tooltip=beaterperc" + coach.fullcount + "]" + coach.beatenwins + "-" + coach.beatenties + "-" + coach.beatenloss + "[/td]";
				wR += "[td]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss + "[/td]";
				wR += "[td]" + coach.opponentP + "[/td]";
				wR += "[td]" + coach.TDandCASdif + "[/td]";
				wR += "[td]" + coach.confTDandCASdif + "[/td]";
				wR += "[td]" + filterPropertyMessage(coach.conftiebreak) +"[/td]";

				wR += "[/tr]";
			});
			wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][/td][/tr]";
		});
		wR += "[/table]";

		wR += "[block] [/block]";
		wR += "[block][/block]";

		wR += "[block=center size=16 bg=yellow]Quarterfinalists[/block]";
		wR += "[table width=100%][tr fg=yellow][th bg=yellow fg=black]Rank[/th][th bg=yellow fg=black]Coach[/th][th bg=yellow fg=black]Team[/th][th bg=yellow fg=black] [/th][th bg=yellow fg=black]Team[/th][th bg=yellow fg=black]Coach[/th][th bg=yellow fg=black]Rank[/th][/tr]";
		wR += "[tr][td colspan=7 bg=yellow][block=center]KFC Conference[/block][/td][/tr]";
		//	wR +="[tr][td]1st[/td][td]"+conferences[0].coaches[0].coachname+"[/td][td]"+conferences[0].coaches[0].teamname+"[/td][td]:[/td][td]"+conferences[0].coaches[5].teamname+"[/td][td]"+conferences[0].coaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]1st[/td][td]" + conferences[0].coaches[0].coachname + "[/td][td]" + conferences[0].coaches[0].teamname + "[/td][td=center]:[/td][td] Worst Ranked Coach Winning[/td][td]KFC Playoffs[td][/td][/tr]";
		wR += "[tr][td]2nd[/td][td]" + conferences[0].coaches[1].coachname + "[/td][td]" + conferences[0].coaches[1].teamname + "[/td][td=center]:[/td][td] Best Ranked Coach Winning[/td][td]KFC Playoffs[/td][td][/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";

		wR += "[tr][td colspan=7 bg=yellow][block=center]SHC Conference[/block][/td][/tr]";
		//		wR +="[tr][td]1st[/td][td]"+conferences[1].coaches[0].coachname+"[/td][td]"+conferences[1].coaches[0].teamname+"[/td][td]:[/td][td]"+conferences[1].coaches[5].teamname+"[/td][td]"+conferences[1].coaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]1st[/td][td]" + conferences[1].coaches[0].coachname + "[/td][td]" + conferences[1].coaches[0].teamname + "[/td][td=center]:[/td][td]Worst Ranked Coach Winning[/td][td]SHC Playoffs[/td][td][/td][/tr]";
		wR += "[tr][td]2nd[/td][td]" + conferences[1].coaches[1].coachname + "[/td][td]" + conferences[1].coaches[1].teamname + "[/td][td=center]:[/td][td] Best Ranked Coach Winning[/td][td]SHC Playoffs[/td][td][/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";
		wR += "[/table]";
		wR += "[block=center size=16 bg=purple fg=yellow]Predicted Playoffs[/block]";
		wR += "[table width=100%][tr fg=yellow][th fg=yellow bg=purple]Rank[/th][th bg=purple fg=yellow ]Coach[/th][th bg=purple fg=yellow ]Team[/th][th bg=purple fg=yellow ] [/th][th bg=purple fg=yellow ]Team[/th][th bg=purple fg=yellow ]Coach[/th][th bg=purple fg=yellow ]Rank[/th][/tr]";
		wR += "[tr][td colspan=7 bg=purple fg=yellow][block=center]KFC Conference[/block][/td][/tr]";
		//	wR +="[tr][td]1st[/td][td]"+conferences[0].coaches[0].coachname+"[/td][td]"+conferences[0].coaches[0].teamname+"[/td][td]:[/td][td]"+conferences[0].coaches[5].teamname+"[/td][td]"+conferences[0].coaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]3rd[/td][td]" + conferences[0].coaches[2].coachname + "[/td][td]" + conferences[0].coaches[2].teamname + "[/td][td=center]:[/td][td]" + conferences[0].coaches[5].teamname + "[/td][td]" + conferences[0].coaches[5].coachname + "[/td][td]6th[/td][/tr]";
		wR += "[tr][td]4th[/td][td]" + conferences[0].coaches[3].coachname + "[/td][td]" + conferences[0].coaches[3].teamname + "[/td][td=center]:[/td][td]" + conferences[0].coaches[4].teamname + "[/td][td]" + conferences[0].coaches[4].coachname + "[/td][td]5th[/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";

		wR += "[tr][td colspan=7 bg=purple fg=yellow][block=center]SHC Conference[/block][/td][/tr]";
		//		wR +="[tr][td]1st[/td][td]"+conferences[1].coaches[0].coachname+"[/td][td]"+conferences[1].coaches[0].teamname+"[/td][td]:[/td][td]"+conferences[1].coaches[5].teamname+"[/td][td]"+conferences[1].coaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]3rd[/td][td]" + conferences[1].coaches[2].coachname + "[/td][td]" + conferences[1].coaches[2].teamname + "[/td][td=center]:[/td][td]" + conferences[1].coaches[5].teamname + "[/td][td]" + conferences[1].coaches[5].coachname + "[/td][td]6th[/td][/tr]";
		wR += "[tr][td]4th[/td][td]" + conferences[1].coaches[3].coachname + "[/td][td]" + conferences[1].coaches[3].teamname + "[/td][td=center]:[/td][td]" + conferences[1].coaches[4].teamname + "[/td][td]" + conferences[1].coaches[4].coachname + "[/td][td]5th[/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";

		wR += "[/table]";
		wR += "";
		wR += "";
		wR += "[block=center size=16 bg=purple fg=yellow] [/block]";
		/*	wR += "[block bg=white]"
		wR +="[block=center]First KFC[block=floatleft][/block][block=floatright]Second SHC[/block][/block]";
		wR +="[block=center]First KFC[block=floatleft][/block][block=floatright]Second SHC[/block][/block]";*/

		wR += "[/block]"

		wR += "[/block][/block][/block]";
		return wR;
	}



function secondscoreTable() {
		var wR = "";
		var thColor = "red";
		var fgColor = "white";
		var th = 18;
		var backgroundCol = "#e6ddc7";
		var winimage = "https://fumbbl.com/i/496166";
			wR += "[block=hidden group=basic id=scoreconference][toggle=image group=basic block=leaguescore label=League src=/i/501699][img]/i/495552[/img][toggle=image group=basic block=scorediv label=Divisions src=/i/495573]";
		wR += "[table width=100%]";

		conferences.forEach(function (div) {
			if (div.name == "SHC") {
				thColor = "blue";
				fgColor = "white";
				winimage = "/i/496217";
			}

			wR += "[tr fg=" + fgColor + "][th bg=" + thColor + "]From[/th][th bg=" + thColor + "]Logo[/th][th bg=" + thColor + "]#[/th][th bg=" + thColor + "] Coach[/th][th bg=" + thColor + "]" + div.name + " Team[/th][th bg=" + thColor + "][toggle=image label=W block=conference group=basic src=" + winimage + "][/th][th bg=" + thColor + "]T[/th][th bg=" + thColor + "]L[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Div[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Conf[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]Beaten[/th][th bg=" + thColor + "]Oppo[/th][th bg=" + thColor + "]Score[/th][th bg=" + thColor + "]C&TD[/th][th bg=" + thColor + "]CCTD[/th][th bg=" + thColor + "]Tie Break[/th][/tr]";
			div.scorecoaches.forEach(function (coach, coachdex) {
				var cheesecake = "white";
				if (coachdex % 2 == 1) {
					cheesecake = "#efefef";

				}if (coachdex == 0) {
					cheesecake = "#ffff33";

				}if (coachdex == 1) {
					cheesecake = "#ffff00";

				}
				if (coachdex == 2) {
					cheesecake = "#7ad";

				}
				if ( coachdex == 3) {
					cheesecake = "#8be";
				}

				if (conferences[0].scorecoaches[4] == coach || conferences[1].scorecoaches[4] == coach) {

					cheesecake = "#add";
				}
				if (conferences[0].scorecoaches[5] == coach || conferences[1].scorecoaches[5] == coach) {
					cheesecake = "#bee";
				}

				wR += "[tr bg=" + cheesecake + "]";

				wR += "[td]" + coach.direction + "[/td]";
				wR += "[td=automargin blackborder border1 bg=white][img h=34 w=50]" + coach.logo + "[/img][/td]"
				wR += "[td]" + (coachdex + 1) + ".[/td]";
				wR += "[td][url=https://fumbbl.com/~" + coach.coachname + "]" + coach.coachname + "[/url][/td]";
				wR += "[td][url=" + coach.teamURL + "]" + coach.teamname + "[/url][/td]";
				wR += "[td][block tooltip=coachbeats" + coach.fullcount + "]" + coach.win + "[/block][/td]";
				wR += "[td]" + coach.tie + "[/td]";
				wR += "[td][block tooltip=coachdefeats" + coach.fullcount + "]" + coach.loss + "[/block][/td]";
				wR += "[td]" + coach.score + "[/td]";
				wR += "[td]" + coach.divwins + "-" + coach.divtie + "-" + coach.divloss + "[/td]";
				wR += "[td]" + coach.divscore + "[/td]";
				wR += "[td]" + coach.confwins + "-" + coach.conftie + "-" + coach.confloss + "[/td]";
				wR += "[td]" + coach.confscore + "[/td]";
				wR += "[td]" + coach.beatenwins + "-" + coach.beatenties + "-" + coach.beatenloss + "[/td]";
				wR += "[td]" + coach.opponentwins + "-" + coach.opponentties + "-" + coach.opponentloss + "[/td]";
				wR += "[td]" + coach.opponentscore + "[/td]";
				wR += "[td]" + coach.TDandCASdif + "[/td]";
				wR += "[td]" + coach.confTDandCASdif + "[/td]";
				wR += "[td]" + filterPropertyMessage(coach.scoreconftiebreak) + coach.scoreconftieheight+ "[/td]";

				wR += "[/tr]";
			});
			wR += "[tr][td colspan=" + th + " bg=" + backgroundCol + "][/td][/tr]";
		});
		wR += "[/table]";

		wR += "[block] [/block]";
		wR += "[block][/block]";

		wR += "[block=center size=16 bg=yellow]Quarterfinalists[/block]";
		wR += "[table width=100%][tr fg=yellow][th bg=yellow fg=black]Rank[/th][th bg=yellow fg=black]Coach[/th][th bg=yellow fg=black]Team[/th][th bg=yellow fg=black] [/th][th bg=yellow fg=black]Team[/th][th bg=yellow fg=black]Coach[/th][th bg=yellow fg=black]Rank[/th][/tr]";
		wR += "[tr][td colspan=7 bg=yellow][block=center]KFC Conference[/block][/td][/tr]";
		//	wR +="[tr][td]1st[/td][td]"+conferences[0].scorecoaches[0].coachname+"[/td][td]"+conferences[0].scorecoaches[0].teamname+"[/td][td]:[/td][td]"+conferences[0].scorecoaches[5].teamname+"[/td][td]"+conferences[0].scorecoaches[5].coachname+"[td]6th[/td][/tr]";
		//wR += "[tr][td]1st[/td][td]" + conferences[0].scorecoaches[0].coachname + "[/td][td]" + conferences[0].scorecoaches[0].teamname + "[/td][td=center]:[/td][td] Worst Ranked Coach Winning[/td][td]KFC Playoffs[td][/td][/tr]";
		wR += "[tr][td]1st[/td][td]" + conferences[0].scorecoaches[0].coachname + "[/td][td]" + conferences[0].scorecoaches[0].teamname + "[/td][td=center]:[/td][td]" + conferences[0].scorecoaches[5].teamname + "[/td][td]" + conferences[0].scorecoaches[5].coachname + "[td]6th[/td][td=center][/tr]";
		wR += "[tr][td]2nd[/td][td]" + conferences[0].scorecoaches[1].coachname + "[/td][td]" + conferences[0].scorecoaches[1].teamname + "[/td][td=center]:[/td][td] Best Ranked Coach Winning[/td][td]KFC Playoffs[/td][td][/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";

		wR += "[tr][td colspan=7 bg=yellow][block=center]SHC Conference[/block][/td][/tr]";
		//		wR +="[tr][td]1st[/td][td]"+conferences[1].scorecoaches[0].coachname+"[/td][td]"+conferences[1].scorecoaches[0].teamname+"[/td][td]:[/td][td]"+conferences[1].scorecoaches[5].teamname+"[/td][td]"+conferences[1].scorecoaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]1st[/td][td]" + conferences[1].scorecoaches[0].coachname + "[/td][td]" + conferences[1].scorecoaches[0].teamname + "[/td][td=center]:[/td][td]Worst Ranked Coach Winning[/td][td]SHC Playoffs[/td][td][/td][/tr]";
		wR += "[tr][td]2nd[/td][td]" + conferences[1].scorecoaches[1].coachname + "[/td][td]" + conferences[1].scorecoaches[1].teamname + "[/td][td=center]:[/td][td] Best Ranked Coach Winning[/td][td]SHC Playoffs[/td][td][/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";
		wR += "[/table]";
		wR += "[block=center size=16 bg=purple fg=yellow]Predicted Playoffs[/block]";
		wR += "[table width=100%][tr fg=yellow][th fg=yellow bg=purple]Rank[/th][th bg=purple fg=yellow ]Coach[/th][th bg=purple fg=yellow ]Team[/th][th bg=purple fg=yellow ] [/th][th bg=purple fg=yellow ]Team[/th][th bg=purple fg=yellow ]Coach[/th][th bg=purple fg=yellow ]Rank[/th][/tr]";
		wR += "[tr][td colspan=7 bg=purple fg=yellow][block=center]KFC Conference[/block][/td][/tr]";
		//	wR +="[tr][td]1st[/td][td]"+conferences[0].scorecoaches[0].coachname+"[/td][td]"+conferences[0].scorecoaches[0].teamname+"[/td][td]:[/td][td]"+conferences[0].scorecoaches[5].teamname+"[/td][td]"+conferences[0].scorecoaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]3rd[/td][td]" + conferences[0].scorecoaches[2].coachname + "[/td][td]" + conferences[0].scorecoaches[2].teamname + "[/td][td=center]1:2[/td][td]" + conferences[0].scorecoaches[5].teamname + "[/td][td]" + conferences[0].scorecoaches[5].coachname + "[td]6th[/td][/tr]";
		wR += "[tr][td]4th[/td][td]" + conferences[0].scorecoaches[3].coachname + "[/td][td]" + conferences[0].scorecoaches[3].teamname + "[/td][td=center]:[/td][td]" + conferences[0].scorecoaches[4].teamname + "[/td][td]" + conferences[0].scorecoaches[4].coachname + "[td]5th[/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";

		wR += "[tr][td colspan=7 bg=purple fg=yellow][block=center]SHC Conference[/block][/td][/tr]";
		//		wR +="[tr][td]1st[/td][td]"+conferences[1].scorecoaches[0].coachname+"[/td][td]"+conferences[1].scorecoaches[0].teamname+"[/td][td]:[/td][td]"+conferences[1].scorecoaches[5].teamname+"[/td][td]"+conferences[1].scorecoaches[5].coachname+"[td]6th[/td][/tr]";
		wR += "[tr][td]3rd[/td][td]" + conferences[1].scorecoaches[2].coachname + "[/td][td]" + conferences[1].scorecoaches[2].teamname + "[/td][td=center]:[/td][td]" + conferences[1].scorecoaches[5].teamname + "[/td][td]" + conferences[1].scorecoaches[5].coachname + "[td]6th[/td][/tr]";
		wR += "[tr][td]4th[/td][td]" + conferences[1].scorecoaches[3].coachname + "[/td][td]" + conferences[1].scorecoaches[3].teamname + "[/td][td=center]:[/td][td]" + conferences[1].scorecoaches[4].teamname + "[/td][td]" + conferences[1].scorecoaches[4].coachname + "[td]5th[/td][/tr]";
		wR += "[tr][td][/td][td][/td][td][/td][td][/td][td][/td][td][/td][/tr]";

		wR += "[/table]";
		wR += "";
		wR += "";
		wR += "[block=center size=16 bg=purple fg=yellow] [/block]";
		/*	wR += "[block bg=white]"
		wR +="[block=center]First KFC[block=floatleft][/block][block=floatright]Second SHC[/block][/block]";
		wR +="[block=center]First KFC[block=floatleft][/block][block=floatright]Second SHC[/block][/block]";*/

		wR += "[/block]"

		wR += "[/block][/block][/block]";
		return wR;
	}


}
function getXMLtag(tag, call) {
	var needed;
	if (call)
		needed = call.getElementsByTagName(tag)[0].textContent;
	else
		needed = document.getElementsByTagName(tag)[0].textContent;
	return needed;
}

function allHaveProp(arry, prop, valu) {
	var cnt = 0;
	arry.forEach(function (ar) {
		if (ar[prop] == valu) {
			cnt++;
		}

	});
	if (cnt == arry.length) {
		return true;
	} else {
		return false;
	}
}

function sameValueArray(arry, prop, valu, prop2, valu2) {
	var shortarry = [];
	arry.forEach(function (ar) {
		if (ar[prop] == valu) {
			if (!ar[prop2] || ar[prop2] == valu2) {
				shortarry.push(ar);

			}

		}

	});
	return shortarry;
}

function wri(targetElement, addSomeText) { //if no text is given, wri will just clear the node out
	while (targetElement.firstChild)
		targetElement.removeChild(targetElement.firstChild);
	if (addSomeText)
		targetElement.appendChild(document.createTextNode(addSomeText));
}

function wr(targetElement, addSomeText) { //if no text is given, wri will just clear the node out
	var writeArea = document.getElementById("noteedit");
	if (addSomeText) {
		targetElement.appendChild(document.createTextNode(addSomeText));
	} else {
		writeArea.appendChild(document.createTextNode(targetElement)); //createtextnode becomes addsometext instead and is added directly

	}
}

function sortBy(coaches, environment, sortArray, property) {

	property = property || sortArray[0];

	//set variables
	var i;
	var len = coaches.length;
	var coach1;
	var coach2;
	var tieBreakLists = [];
	var tiebreakrunning = false;
	var sortedList;
	var coaches2 = [];

	//do a presort of everything
	coaches.sort(function (a, b) {

		if (property == "head2head") {
			if (b.beat.indexOf(a)) {
				return -1;

			} else if (a.beat.indexOf(b)) {

				return 1;
			} else {

				return 0;
			}

		}

		return b[property] - a[property];
	})

	//now get into sorting details
	for (i = 0; i < len - 1; i++) {

		coach1 = coaches[i];
		coach2 = coaches[i + 1]

			if (property == "head2head") {
				var gottaBeatAll = true;
				coaches.forEach(function (otherCoach) {
					if (coach1.beat.indexOf(otherCoach) > -1) {}
					else {
						gottaBeatAll = false;

					}

				});
				if (gottaBeatAll === true) {

					coaches.slice(i);

					coaches2 = sortBy(coaches, sortArray[sortArray.indexOf(property)], sortArray);
					coaches2.splice(0, 0, coach1);
					coach1[environment + "tiebreak"] = property;
					return coaches2;
				} else {
					var gottaBeatAll = true;
					coaches.forEach(function (otherCoach) {
						if (coach1.wasbeat.indexOf(otherCoach) > -1) {}
						else {
							gottaBeatAll = false;

						}

					});
					if (gottaBeatAll === true) {

						coaches.slice(i);

						coaches2 = sortBy(coaches, sortArray[sortArray.indexOf(property)], sortArray);
						coaches2.push(coach1);
						coach1[environment + "tiebreak"] = property;
						return coaches2;
					}

				}
			}

			return coaches;
	}

	function concludeTieBreak() {
		tiebreakrunning = false;
		if (sortArray.indexOf(property) < sortArray.length - 1) {
			sortedList = undefined;
			sortedList = sortBy(tieBreakLists[tieBreakLists.length - 1], environment, sortArray, sortArray[sortArray.indexOf(property) + 1]);
			if (tieBreakLists[tieBreakLists.length - 1].constructor === Array) {
				var cutOff = tieBreakLists[tieBreakLists.length - 1].length;
			} else {
				cutOff = 0;
			}
			var firstCut = tieBreakLists[tieBreakLists.length - 1];
			coaches.splice(firstCut[firstCut.length - cutOff], cutOff, sortedList);
			return coaches;

		}
	}
}

function filterPropertyMessage(property) {
	var message;
	property = property || "";

	if (property.indexOf("win") > -1) {
		message = "";

	} else if (property.indexOf("head2head") > -1) {
		message = "Head To Head";

	} else if (property.indexOf("divper") > -1) {
		message = "Division Percentage";

	} else if (property.indexOf("confper") > -1) {
		message = "Conference Percentage";

	}  else if (property.indexOf("nentper") > -1) {
		message = "Opponent Percentage";

	}   else if (property.indexOf("TDandCASdif") > -1) {
		message = "TD and CAS Difference";

	} else if (property.indexOf("confTDandCAS") > -1) {
		message = "TD and CAS Difference in Conference";

	}

	else if (property === "score") {
		message = "";

	} else if (property === "draftscore") {
		message = "";

	}
	else if (property.indexOf("divscore") > -1) {
		message = "Division Score";

	} else if (property.indexOf("confscore") > -1) {
		message = "Conference Score";

	}  else if (property.indexOf("nentscore") > -1) {
		message = "Opponent Score";

	}	else {
		message = property;
	}

	return message;

}

function tieBreakList() {
	var tiebreaklist = [];

	return tiebreaklist;
}

function sortAlgorythm(property, text, fullSortArray) {
	var sortFragment;

}

function propertyTrack(property) {
	if (!this[property]) {
		this[property] = 0
	};

	this[property] += 1;
}

function sorterScript(coaches, environment, sortCriteria, sortStart, conditionalFunction) {

	//sortStart=sortStart||0;
	var currentProperty = sortCriteria[sortStart];

	if (sortCriteria.length <= sortStart) {
		coaches.forEach(function (coach) {
			coach[environment + "tiebreak"] = "Coin Toss Needed"
		});
		return coaches;
	}

	if (coaches.length < 2) {

		coaches.forEach(function (coach) {
			coach[environment + "tiebreak"] = sortCriteria[sortStart];
		});

		return coaches;

	}

	//set variables
	var i;
	var len = coaches.length;
	var coach1;
	var coach2;
	var conditionalCheck;

	var remainingCoachList = [];
	var sortedCoachList = [];
	var bigTie = [];
		var smallTie = [];
		var clearedList = coaches.slice(0);
		var clearedList2 = coaches.slice(0);


	var sortPriority = sortCriteria.indexOf(currentProperty);
	if (currentProperty.indexOf("conditional") > -1) {
		conditonalCheck = conditionalFunction(coaches);
		if (conditionalCheck === false) {

			return sorterScript(coaches, environment, sortCriteria, sortStart + 1, conditionalFunction);

		}
	}
	for (i = 0; i < len; i++) {
		coach1 = coaches[i];
		var allSmaller = true;
		var allBigger = true;
		var tiedSmaller = true;
		var tiedBigger = true;

		//console.log(coach1.coachname+": "+coach1.confpercentage+" Conference Percentage")

		coaches.forEach(function (coach) {


			if (coach1 === coach) {
				return;
			}

			if (currentProperty === "head2head") {
		//	window.alert("itshouldwork!")
				if (coach1.beat.indexOf(coach) === -1) {
					allSmaller = false;
				}


			} else {

				if (coach1[currentProperty] <= coach[currentProperty]) {
					allSmaller = false;

				}


			}
		});



		if (allSmaller === true) {

			clearOutCoachLists();
		//	console.log("Best coach: " + coach1.coachname + " in " + (sortStart + 1) + ". sort point.");
			sortedCoachList = sorterScript(remainingCoachList, environment, sortCriteria, 0, conditionalFunction);


			if (sortedCoachList.length==1){
				genTie(sortedCoachList[0]);

			}

			sortedCoachList.unshift(coach1);
			return sortedCoachList;

		}
coaches.forEach(function (coach) {


			if (coach1 === coach) {
				return;
			}

			if (currentProperty === "head2head") {

				if (coach1.wasbeat.indexOf(coach) === -1) {

				allBigger = false;
				}

			} else {




				if (coach1[currentProperty] < coach[currentProperty]) {
					tiedSmaller = false;

				}

				if (coach1[currentProperty] >= coach[currentProperty]) {
					allBigger = false;

				}
				if (coach1[currentProperty] > coach[currentProperty]) {
					tiedBigger = false;

				}

			}
		});
		if (allBigger === true) {

			clearOutCoachLists();
		//	console.log("Worst coach: " + coach1.coachname + " in " + (sortStart + 1) + ". sort point.");
			sortedCoachList = sorterScript(remainingCoachList, environment, sortCriteria, 0, conditionalFunction);
			if (sortedCoachList.length==1){
				genTie(sortedCoachList[0]);

			}

			sortedCoachList.push(coach1);
			return sortedCoachList;
		}


	//this handles not just tied values but also converts head2head into the big tie array.
		if (tiedSmaller === true) {


			bigTie.push(coach1);
			var coachInt = clearedList.indexOf(coach1);
			clearedList.splice(coachInt, 1);


		} else if (tiedBigger === true) {
			smallTie.push(coach1);
			var coachInt = clearedList2.indexOf(coach1);
			clearedList2.splice(coachInt, 1);

		}

	}

//
//window.alert(bigTie.length)
	remainingCoachList = [];
	sortedCoachList = [];
	var temporaryList = [];


	if (bigTie.length>0) {

		//console.log("tiesrart "+currentProperty)
		//	bigTie.forEach(function(coach){console.log("Bigtie: "+coach.coachname)})
	//	console.log("tieend")
		if(bigTie.length<coaches.length){
		temporaryList = sorterScript(bigTie, environment, sortCriteria, 0, conditionalFunction);
	} else {
		temporaryList = sorterScript(bigTie, environment, sortCriteria, (sortStart + 1), conditionalFunction);

	}if (temporaryList.length==1){
				genTie(temporaryList[0]);

			}

		remainingCoachList = sorterScript(clearedList, environment, sortCriteria, 0, conditionalFunction);
			if	(remainingCoachList.length==1){
				genTie(remainingCoachList[0]);

			}


		sortedCoachList = temporaryList.concat(remainingCoachList);
	} else if (smallTie.length>0) {
		//		clearedList2.forEach(function(coach){console.log("From log: "+coach.coachname)})

			if(smallTie.length<coaches.length){
		temporaryList = sorterScript(smallTie, environment, sortCriteria, 0, conditionalFunction);
			}else{
		temporaryList = sorterScript(smallTie, environment, sortCriteria, (sortStart + 1), conditionalFunction);
			}
		if	(temporaryList.length==1){
				genTie(temporaryList[0]);

			}
	remainingCoachList = sorterScript(clearedList2, environment, sortCriteria, 0, conditionalFunction);
	if	(remainingCoachList.length==1){
				genTie(remainingCoachList[0]);
			}


		sortedCoachList = remainingCoachList.concat(temporaryList);

	} else {
		window.alert("Not supposed to happen.")
	}

	return sortedCoachList;

	function clearOutCoachLists() {
		remainingCoachList = [];
		remainingCoachList = coaches.splice(0);
		remainingCoachList.splice(i, 1);
		sortedCoachList = [];
	genTie(coach1);
	}

	function genTie(coac){

				coac[environment + "tiebreak"] = sortCriteria[sortStart];
			if (sortStart!=0){
		if (sortCriteria[sortStart-1]!="head2head"){
		coac[environment + "tieheight"] = " @ "+(coac[sortCriteria[sortStart-1]]);}
		else {
			coac[environment + "tieheight"] = " @ "+(coac[sortCriteria[sortStart-2]]);
	//	coac[environment + "tieheight"] = " @ "+(coac[sortCriteria[sortStart-1]]); (sortCriteria[sortStart-1]!="head2head")
		}
		} else {
		coac[environment + "tieheight"] = "";
		}

}}


})();
