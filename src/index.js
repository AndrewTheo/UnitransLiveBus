import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import "./shards.min.css";


const rootElement = document.getElementById("root");


class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phase: 0,
            busLine: '',
            direction: 0,
            stopId: ''
        };
    }

    //...
    handleChangeValueTwo = e => {
        this.setState({busLine: e.target.value, phase:1})

    };

    handleChangeDir = e => {
        this.setState({direction: e.target.value, phase:2})
    }

    handleChangeStop = e => {
        var index = e.target.options.selectedIndex;
        this.setState({stopId: e.target.options[index].id, phase:3})
    }
    //...

    render() {
        if(this.state.phase === 0)
        {
            return (
                <div className="select">
                    <h1>Select a Bus Line</h1>
                    <LineSelect onChangeValue={this.handleChangeValueTwo}/>
                </div>
            );
        }
        else if(this.state.phase === 1) {
            return (
                //<ChildTwo value={this.state.value}  onChangeDirection={this.handleChangeDirection}/>
                <div>
                    <h1>Select a Direction</h1>
                    <h2>Selected Line: {this.state.busLine}</h2>
                    <DirectionSelect busLine={this.state.busLine} onChangeDir={this.handleChangeDir}/>
                </div>
            );
        }
        else if(this.state.phase == 2)
        {
            return (
                <div>
                   <h1>Select a Stop </h1>
                   <StopSelect busLine={this.state.busLine} direction={this.state.direction} onChangeStop={this.handleChangeStop} />
                </div>
            );
        }
        else
        {
            return (
                <div>
                    <h1>Time Predictions for - {this.state.busLine} </h1>
                    <TimeData busLine={this.state.busLine} direction={this.state.direction} stopId={this.state.stopId} />
                </div>
            );
        }
    }


}

class LineSelect extends MainApp {
    //...
    render() {
        const busLines = ["A - Downtown / 5th St / Alhambra", "B - Sycamore / Drake ", "C - Sycamore / Wake Forest", "D - Lake Blvd / Arlington", "E - Downtown / F St / J St", "F - Oak Ave / E. Alvarado / N. Anderson", "G - Anderson / Alvarado / N. Sycamore", "J - Anderson / Alvarado / N. Sycamore", "K - Lake Blvd / Arlington", "L - E. 8th St / Moore / Loyola", "M - Cowell / Drew", "O - Shoppers Shuttle / Downtown", "P - Davis Perimeter Counter Clockwise", "Q - Davis Perimeter Clockwise", "S - Davis High", "T - Davis High", "V - West Village", "W - Cowell / Lillard / Drummond", "X - Residence Halls Loop", "Z - Amtrak / 5th St / Target / MU"];

        return (
            <div>
                <form>
                    <label>
                        BusLine:
                        <select className="custom-select selectF" onChange={this.props.onChangeValue}>
                            <option value="" disabled selected>Select a Bus Line</option>
                            {busLines.map((bus, index) => {
                                return <option name={bus.substring(0, 1)}>{bus}</option>;
                            })}
                        </select>
                    </label>
                </form>
            </div>

        );
    }
}

class DirectionSelect extends MainApp {
    //...
    render() {
        var dir = busData["Routes"][this.props.busLine.substring(0,1)]["Directions:"];
        return (
            <div>
                <form>
                    <label>
                        Direction:
                        <select className="custom-select selectF" onChange={this.props.onChangeDir}>
                            <option value="" disabled selected>Select a Direction</option>
                            {dir.map((bus, index) => {
                                return <option key={index} name={bus.substring(0, 1)}>{bus}</option>;
                            })}
                        </select>
                    </label>
                </form>
            </div>

        );
    }
}

class StopSelect extends MainApp {
    //...

    render() {
        console.log(this.props.busLine);
        console.log(this.props.direction);
        var directionNames = busData["Routes"][this.props.busLine.substring(0,1)]["Directions:"];
        var index = directionNames.indexOf(this.props.direction);
        var stopIds;
        var stopNames;
        if(index === 0)
        {
            stopIds = busData["Routes"][this.props.busLine.substring(0,1)]["Stops"]["StopsIN"]["StopID"];
            stopNames = busData["Routes"][this.props.busLine.substring(0,1)]["Stops"]["StopsIN"]["StopNames"];
        }
        else if(index === 1)
        {
            stopIds = busData["Routes"][this.props.busLine.substring(0,1)]["Stops"]["StopsOUT"]["StopID"];
            stopNames = busData["Routes"][this.props.busLine.substring(0,1)]["Stops"]["StopsOUT"]["StopNames"];
        }
        console.log(stopIds)

        console.log(stopNames)
        return (
            <div>
                <form>
                    <label>
                        Direction:
                        <select className="custom-select selectF" onChange={this.props.onChangeStop}>
                            <option value="" disabled selected>Select a Stop</option>
                            {stopNames.map((bus, index) => {
                                return <option key={index} id={stopIds[index]}>{bus}</option>;
                            })}
                        </select>
                    </label>
                </form>
            </div>

        );
    }
}

class TimeData extends MainApp {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            times: [],
        };


    }


    componentDidMount() {
        this.setState({ isLoading: true });

            fetch('http://restbus.info/api/agencies/unitrans/routes/' + this.props.busLine.substring(0,1) + '/stops/' + this.props.stopId + '/predictions')
                .then(response => response.json())
                .then(data => {
                    var resultArray = [];
                    console.log(data);
                    if(data.length != 0)
                    {
                        for(var i = 0; i < data[0].values.length; i++){
                            resultArray.push(data[0].values[i]["minutes"])
                            console.log(data[0].values[i]["minutes"])
                        }
                        this.setState({times: resultArray, isLoading: false })
                    }
                    else {
                        this.setState({isLoading: false })
                    }

                });
    }

    render(){
        if(this.state.isLoading === true)
        {
            return(
              <h3>Loading...</h3>
            );
        }

        if(this.state.times.length === 0)
        {
            return(<h1>Hmmm. Doesn't Seem like any Buses are running right now.</h1>);
        }
        else
        {
            return(
                <div>
                    {/*<h1>{this.state.times}</h1>*/}
                    {this.state.times.map((bus, index) => {
                        return <h2>{bus} min</h2>;
                    })}
                </div>
            );
        }
    }

}


ReactDOM.render(<MainApp />, rootElement )

const busData = {
    "Routes": {
    "A": {"Directions:": ["Inbound to UCD Silo","Outbound to El Cemonte"],
        "Stops" : {"StopsIN": {"StopID": ["22062", "22063", "22064", "22060", "22244", "22065", "22299", "22236", "22068", "22069", "22238", "22071", "22072", "22074", "22077", "22078", "22032", "22030", "22012", "22009", "22006", "22001", "22168", "22258_ar"], "StopNames":["El Cemonte Ave & Glide Dr (SB)", "Cowell Blvd & El Cemonte Ave (WB)", "Cowell Blvd & Mace Blvd (WB)", "Mace Blvd & Cowell Blvd (NB)", "Mace Blvd & 2nd St (NB)", "Alhambra Dr & Mace Blvd (WB)", "Alhambra & Atlantis / Arroyo (WB)", "Alhambra Dr & Atlantis / Carcia (WB)", "5th St & Verona Terrace (SB)", "5th St & Pelz Bike Path (WB)", "5th St & Spafford (WB)", "5th St & San Rafael St (WB)", "5th St & Cantrill (WB)", "5th St & Post Office / Pole Line Rd (WB)", "5th St & Pole Line Rd (WB)", "5th St & Davis PW Corp Yard (WB)", "L St & 425 (SB)", "3rd St & K St (WB)", "H St Alley & 2nd St (SB)", "2nd St & E St (WB)", "C St & 1st St (SB)", "Hutchison Drive & Old Davis Road (WB)", "Hutchison & Shields Library (WB)", "Silo Terminal & Haring Hall (WB)"]}, "StopsOUT":{"StopID": ["22258", "22169", "22000", "22005", "22007", "22011", "22031", "22033", "22076", "22075", "22073", "22234", "22237", "22070", "22300", "22067", "22235", "22066", "22243", "22061", "22062_ar"], "StopNames":["Silo Terminal & Haring Hall (WB)", "Hutchison Dr & Art Building (EB)", "Hutchison Dr & Old Davis Road (EB)", "2nd St & B St (EB)", "2nd St & E St (EB)", "H St & Amtrak Station (NB)", "3rd St & K St (EB)", "L St & 4th St (NB)", "5th St & Pole Line Rd (EB)", "5th St & Post Office / Pole Line (EB)", "5th St & Cantrill  (EB)", "5th St & Pena Dr (EB)", "5th St & Spafford St (EB)", "5th St & Windmere Apts. (EB)", "5th Street & Verona Terrace (EB)", "Alhambra Dr & 5th St (EB)", "Alhambra Dr & Arroyo Ave (EB)", "Alhambra Dr & Mace Blvd (EB)", "Mace Blvd & 2nd St (SB)", "Chiles Rd & Mace Blvd (EB)", "El Cemonte Ave & Glide Dr (SB)"]}}
    },
    "B": {"Directions:": ["Inbound to MU","Outbound to Drake"],
        "Stops" : {"StopsIN": {"StopID": ["22193", "22194", "22195", "22192", "22187", "22190", "22292", "22179", "22167_ar"], "StopNames":["Radcliffe Dr & Apple Ln (NB)", "Drake Dr & Drake Dr  Apts (WB)", "Sycamore Ln & Drake Dr (SB)", "Sycamore Ln & Notre Dame Dr (SB)", "Sycamore Ln & Colby Dr. (SB)", "Sycamore Ln & Cornell Dr (SB)", "Sycamore & 8th (SB)", "Sycamore Ln & Wake Forest Dr (SB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22272", "22230", "22185", "22189", "22188", "22186", "22191", "22193_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "Sycamore Ln & University Mall (NB)", "Sycamore Ln & 8th St (NB)", "Sycamore Ln & Cornell Dr (NB)", "Sycamore Ln & Bucknell Dr (NB)", "Sycamore Ln & Villanova Dr (NB)", "Sycamore Ln & Radcliffe Dr (NB)", "Radcliffe Dr & Apple Ln (NB)"]}}
    },
    "C": {"Directions:": ["Inbound to UCD Silo","Outbound to Wake Forest"],
        "Stops" : {"StopsIN": {"StopID": ["22184", "22182", "22181", "22179", "22176", "22173", "22256_ar"], "StopNames":["8th St & Sycamore Ln (WB)", "Wake Forest Dr & 8th Street (SB)", "Wake Forest Dr & Oxford Cir (EB)", "Sycamore Ln & Wake Forest Dr (SB)", "La Rue Rd & Orchard (SB)", "Hutchison Dr & Bioletti Way (EB)", "Silo Terminal & Center Island (WB)"]}, "StopsOUT":{"StopID": ["22256", "22175", "22160", "22301", "22184_ar"], "StopNames":["Silo Terminal & Center Island (WB)", "La Rue Rd & Orchard (NB)", "Anderson Rd & Russell Blvd (NB)", "Anderson & Sunset (NB)", "8th St & Sycamore Ln (WB)"]}}
    },
    "D": {"Directions:": ["Inbound to UCD Silo","Outbound to Arlington"],
        "Stops" : {"StopsIN": {"StopID": ["22229", "22226", "22227", "22228", "22208", "22210", "22211", "22223", "22224", "22316", "22240", "22173", "22258_ar"], "StopNames":["Russell Blvd & Arlington Farm (WB)", "Lake Blvd & Portage Bay (NB)", "Lake Blvd & Salem Ave (NB)", "Lake Blvd & Westlake Plaza (NB)", "Arlington Blvd & Lake Blvd (SB)", "Arlington Blvd & Cabot St (SB)", "Arlington Blvd & Shasta Dr (SB)", "Arlington Blvd & Westernesse Rd (SB)", "Arlington Blvd & Bucklebury Rd (SB)", "Russell & Arthur (EB)", "Hutchison Dr & Health Sci Drive (EB)", "Hutchison Dr & Bioletti Way (EB)", "Silo Terminal & Haring Hall (WB)"]}, "StopsOUT":{"StopID": ["22258", "22239", "22361", "22225", "22229_ar"], "StopNames":["Silo Terminal & Haring Hall (WB)", "Hutchison Dr & Ext Center (WB)", "Hutchison Dr & Health Sci Dr (WB)", "Russell Blvd & Arthur St (WB)", "Russell Blvd & Arlington Farm (WB)"]}}
    },
    "E":  {"Directions:": ["Inbound to UCD MU","Outbound to J St"],
        "Stops" : {"StopsIN": {"StopID": ["22193", "22194", "22195", "22192", "22187", "22190", "22292", "22179", "22167_ar"], "StopNames":["F St & 12th St (NB)", "F St & 14th St (NB)", "F St & Covell Blvd (NB)", "J St & Menlo Dr (SB)", "J St & Drexel Dr (SB)", "J St & Alice St (SB)", "J St & 8th St (SB)", "8th St & G St (WB)", "F St & 8th St  (SB)", "5th St & D St (WB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22274", "22008", "22014", "22016", "22018", "22020", "22027", "22117", "22116_ar"], "StopNames":["F St & 6th Street  (NB)", "F St & 8th St (NB)", "F St & 12th St (NB)", "Memorial Union & East Island (SB)", "Russell & A St (EB)", "B St & 4th St  (SB)", "3rd St & C St (EB)", "3rd St & E St (EB)", "F St & 4th St  (NB)"]}}
    },
    "F":  {"Directions:": ["Inbound to UCD MU","Outbound to F St"],
        "Stops" : {"StopsIN": {"StopID": ["22145", "22126", "22133", "22132", "22131", "22130", "22129", "22128", "22127", "22312", "22313", "22113", "22114", "22123", "22125", "22148", "22162", "22164", "22166", "22167_ar"], "StopNames":["Oak Ave & Covell (NB)", "Catalina Dr & Alvarado Ave (NB)", "Alvarado Ave & Espana (WB)", "Alvarado & Anderson  (WB)", "Anderson Rd & Bianco (NB)", "Anderson Rd & Valencia (NB)", "Anderson & Oriole (NB)", "Anderson & Sandpiper (EB)", "F Street & Grande (SB)", "F Street & Faro (SB)", "F Street & Bueno (SB)", "F St & Covell Blvd (SB)", "14th St & F St (WB)", "14th St & B St (WB)", "14th St & Davis HS (WB)", "Oak Ave & 14th St (SB)", "Oak Ave & Antioch Dr (SB)", "Oak Ave & 8th St (SB)", "Oak Ave & Russell Blvd (SB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22272", "22165", "22163", "22161", "22314", "22145_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "Oak Ave & Russell Blvd (NB)", "Oak Ave & 8th St (NB)", "Oak Ave & Antioch Dr (NB)", "Oak & 14th Street (NB)", "Oak Ave & Covell (NB)"]}}
    },
    "G":  {"Directions:": ["Inbound to UCD MU","Outbound to N Sycamore"],
        "Stops" : {"StopsIN": {"StopID": ["22144", "22143", "22141", "22138", "22137", "22135", "22155", "22156", "22158", "22302", "22159", "22167_ar"], "StopNames":["North Sycamore Loop (NB)", "Sycamore Ln & Chaparral Apts (SB)", "Sycamore Ln & Antelope (SB)", "Sycamore Ln & Alvarado (SB)", "Alvarado Ave & Sycamore (EB)", "Alvarado Ave & Anderson (EB)", "Anderson Rd & Hanover Dr (SB)", "Anderson Rd & Villanova Dr (SB)", "Anderson Rd & Amherst Dr (SB)", "Anderson & Sunset (SB)", "Anderson Rd & Russell Blvd (SB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22273", "22160", "22301", "22157", "22153", "22154", "22134", "22136", "22139", "22140", "22142", "22144_ar"], "StopNames":["Anderson Rd & Russell Blvd (NB)", "Anderson & Sunset (NB)", "Anderson Rd & Amherst Dr (NB)", "Anderson Rd & Villanova Dr (NB)", "Anderson Rd & Hanover Dr (NB)", "Alvarado Ave & Anderson (WB)", "Alvarado Ave & Sycamore (WB)", "Sycamore Ln & Pepperwood Apts (NB)", "Sycamore Ln & Antelope (NB)", "Sycamore Ln & Chaparral Apts (NB)", "North Sycamore Loop (NB)", "Memorial Union & Main Island (SB)"]}}
    },
    "J":   {"Directions:": ["Inbound to UCD Silo","Outbound to N Sycamore"],
        "Stops" : {"StopsIN": {"StopID": ["22144", "22143", "22141", "22138", "22137", "22135", "22155", "22156", "22158", "22302", "22159", "22176", "22173", "22256_ar"], "StopNames":["North Sycamore Loop (NB)", "Sycamore Ln & Chaparral Apts (SB)", "Sycamore Ln & Antelope (SB)", "Sycamore Ln & Alvarado (SB)", "Alvarado Ave & Sycamore (EB)", "Alvarado Ave & Anderson (EB)", "Anderson Rd & Hanover Dr (SB)", "Anderson Rd & Villanova Dr (SB)", "Anderson Rd & Amherst Dr (SB)", "Anderson & Sunset (SB)", "Anderson Rd & Russell Blvd (SB)", "La Rue Rd & Orchard (SB)", "Hutchison Dr & Bioletti Way (EB)", "Silo Terminal & Center Island (WB)"]}, "StopsOUT":{"StopID": ["22256", "22175", "22160", "22301", "22157", "22153", "22154", "22134", "22136", "22139", "22140", "22142", "22144_ar"], "StopNames":["Silo Terminal & Center Island (WB)", "La Rue Rd & Orchard (NB)", "Anderson Rd & Russell Blvd (NB)", "Anderson & Sunset (NB)", "Anderson Rd & Amherst Dr (NB)", "Anderson Rd & Villanova Dr (NB)", "Anderson Rd & Hanover Dr (NB)", "Alvarado Ave & Anderson (WB)", "Alvarado Ave & Sycamore (WB)", "Sycamore Ln & Pepperwood Apts (NB)", "Sycamore Ln & Antelope (NB)", "Sycamore Ln & Chaparral Apts (NB)", "North Sycamore Loop (NB)"]}}
    },
    "K":   {"Directions:": ["Inbound to UCD Silo","Outbound to Arlington"],
        "Stops" : {"StopsIN": {"StopID": ["22229", "22226", "22227", "22228", "22208", "22210", "22211", "22216", "22217", "22220", "22221", "22177", "22167_ar"], "StopNames":["Russell Blvd & Arlington Farm (WB)", "Lake Blvd & Portage Bay (NB)", "Lake Blvd & Salem Ave (NB)", "Lake Blvd & Westlake Plaza (NB)", "Arlington Blvd & Lake Blvd (SB)", "Arlington Blvd & Cabot St (SB)", "Arlington Blvd & Shasta Dr (SB)", "Humboldt Ave & Imperial  (EB)", "Humboldt Ave & Arthur St (EB)", "Arthur St & North Adams St (SB)", "Arthur St & Alameda Ave (SB)", "Russell Blvd & Sycamore Ln (EB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22274", "22178", "22225", "22229_ar"], "StopNames":["Memorial Union & East Island (SB)", "Russell Blvd & Sycamore Ln (WB)", "Russell Blvd & Arthur St (WB)", "Russell Blvd & Arlington Farm (WB)"]}}
    },
    "L":   {"Directions:": ["Inbound to UCD Silo","Outbound to Loyola"],
        "Stops" : {"StopsIN": {"StopID": ["22092", "22106", "22260", "22249", "22294", "22261", "22250", "22081", "22082", "22085", "22091", "22088", "22087", "22280", "22281", "22103", "22104", "22110", "22118", "22120", "22023", "22014", "22001", "22168", "22258_ar"], "StopNames":["Pole Line Rd & Claremont Dr (NB)", "Pole Line Rd & Picasso Ave (NB)", "Pole Line & Donner (NB)", "Moore Blvd & Pole Line Rd (EB)", "Moore Blvd & Rockwell (EB)", "Moore Blvd & Raphael (EB)", "Moore Blvd & Pollock (EB)", "Monarch Ln & Campbell (SB)", "Temple Dr & Balsam Pl (WB)", "Tulip Ln & Cascade Pl (SB)", "Loyola Dr & Regis Dr (WB)", "Loyola Dr & Nutmeg Ln (WB)", "Loyola Dr & Whittier Dr (WB)", "Pole Line & Wahl Way (SB)", "East 8th Street & Pole Line Road (WB)", "8th St & Chestnut Ln (WB)", "8th St & L St (WB)", "8th St & J St (WB)", "8th St & G St (WB)", "8th St & D St (WB)", "B St & 7th St (SB)", "Russell Blvd & A St (WB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22258", "22169", "22000", "22013", "22022", "22024", "22121", "22119", "22111", "22105", "22102", "22094", "22357", "22092_ar"], "StopNames":["B St & 5th St (NB)", "B St & 7th St (NB)", "8th St & D St (EB)", "8th St & G St (EB)", "8th St & J St (EB)", "8th St & L St (EB)", "8th St & Chestnut Ln (EB)", "Pole Line Rd & 8th St (NB)", "Pole Line Rd & Loyola Dr (NB)", "Pole Line Rd & Claremont Dr (NB)", "Silo Terminal & Haring Hall (WB)", "Hutchison Dr & Art Building (EB)", "Hutchison Dr & Old Davis Road (EB)", "B St & 4th St (NB)"]}}
    },
    "M":   {"Directions:": ["Inbound to MU","Outbound to Drew"],
        "Stops" : {"StopsIN": {"StopID": ["22296", "22318", "22045", "22038", "22036", "22034", "22242", "22003", "22013", "22021", "22167_ar"], "StopNames":["Drew & Research Park Drive (NB)", "Research Park Dr & Cowell (EB)", "Cowell Blvd & Halsey Cir (WB)", "Cowell Blvd & Valdora St (WB)", "Cowell Blvd & Drew Ave (WB)", "Cowell Blvd & Research Park S Dr (WB)", "Richards Blvd & Olive Dr (NB)", "1st St & D St (WB)", "B St & 4th St (NB)", "Russell Blvd & A St (WB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22274", "22008", "22014", "22002", "22004", "22035", "22295", "22296_ar"], "StopNames":["Memorial Union & East Island (SB)", "B St & 4th St  (SB)", "1st St & C St (EB)", "Richards Blvd & Olive Dr (SB)", "Cowell Blvd & Research Park S Dr (EB)", "Drew Ave & Cowell Blvd (NB)", "Drew & Research Park Drive (NB)", "Russell & A St (EB)"]}}
    },
    "O":   {"Directions:": ["Inbound to UCD MU","Outbound to Target"],
        "Stops" : {"StopsIN": {"StopID": ["22282", "22326", "22283", "22071", "22072", "22074", "22281", "22103", "22325", "22032", "22030", "22012", "22009", "22013", "22021", "22167_ar"], "StopNames":["2nd St. & Target Drive (WB)", "2nd Street & Cousteau Place (WB)", "Pena  & 2nd St. (NB)", "5th St & San Rafael St (WB)", "5th St & Cantrill (WB)", "5th St & Post Office / Pole Line Rd (WB)", "East 8th Street & Pole Line Road (WB)", "8th St & Chestnut Ln (WB)", "L Street & Duke (SB)", "L St & 425 (SB)", "3rd St & K St (WB)", "H St Alley & 2nd St (SB)", "2nd St & E St (WB)", "B St & 4th St (NB)", "Russell Blvd & A St (WB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22272", "22008", "22014", "22005", "22007", "22011", "22031", "22033", "22076", "22075", "22073", "22234", "22237", "22070", "22300", "22067", "22235", "22066", "22243", "22282_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "Russell & A St (EB)", "B St & 4th St  (SB)", "2nd St & B St (EB)", "2nd St & E St (EB)", "H St & Amtrak Station (NB)", "3rd St & K St (EB)", "L St & 4th St (NB)", "5th St & Pole Line Rd (EB)", "5th St & Post Office / Pole Line (EB)", "5th St & Cantrill  (EB)", "5th St & Pena Dr (EB)", "5th St & Spafford St (EB)", "5th St & Windmere Apts. (EB)", "5th Street & Verona Terrace (EB)", "Alhambra Dr & 5th St (EB)", "Alhambra Dr & Arroyo Ave (EB)", "Alhambra Dr & Mace Blvd (EB)", "Mace Blvd & 2nd St (SB)", "2nd St. & Target Drive (WB)"]}}
    },
    "P":   {"Directions:": ["Counterclockwise to UCD MU"],
        "Stops" : {"StopsIN": {"StopID": ["22272", "22025", "22028", "22319", "22076", "22039", "22297", "22174", "22254", "22255", "22048", "22051", "22054", "22056", "22057", "22060", "22244", "22363", "22362", "22097", "22113", "22114", "22123", "22125", "22147", "22149", "22153", "22154", "22196", "22199", "22200", "22203", "22205", "22208", "22210", "22211", "22223", "22224", "22316", "22177", "22167_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "5th St & D St (EB)", "5th St & G St (EB)", "5th Street & K Street (EB)", "5th St & Pole Line Rd (EB)", "Pole Line Rd & Cowell Blvd (SB)", "Lillard Dr & Cowell Blvd (EB)", "Lillard Dr & Evans Ct (EB)", "Lillard & Drummond (EB)", "Drummond & Albany (NB)", "Cowell Blvd & Drummond Ave (EB)", "Cowell Blvd & Ohlone St (EB)", "Cowell Blvd & La Vida (EB)", "Cowell Blvd & Ensenada Dr (EB)", "Cowell Blvd & Sunrise Ct (EB)", "Mace Blvd & Cowell Blvd (NB)", "Mace Blvd & 2nd St (NB)", "Covell Blvd & Wright Blvd (WB)", "Covell Blvd & Pole Line Rd (WB)", "Covell Blvd & J St (WB)", "F St & Covell Blvd (SB)", "14th St & F St (WB)", "14th St & B St (WB)", "14th St & Davis HS (WB)", "14th St & Oak St (WB)", "Villanova Dr & Reed Dr (WB)", "Anderson Rd & Villanova Dr (NB)", "Anderson Rd & Hanover Dr (NB)", "Covell Blvd & Sycamore Ln (WB)", "Covell Blvd & John Jones Rd (WB)", "Covell Blvd & Shasta Dr (WB)", "Lake Blvd & Covell Blvd (SB)", "Lake Blvd & Oyster Bay (SB)", "Arlington Blvd & Lake Blvd (SB)", "Arlington Blvd & Cabot St (SB)", "Arlington Blvd & Shasta Dr (SB)", "Arlington Blvd & Westernesse Rd (SB)", "Arlington Blvd & Bucklebury Rd (SB)", "Russell & Arthur (EB)", "Russell Blvd & Sycamore Ln (EB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}}
    },
    "Q": {"Directions:": ["Clockwise to UCD MU"],
        "Stops" : {"StopsIN": {"StopID": ["22272", "22178", "22225", "22494", "22495", "22212", "22209", "22207", "22206", "22204", "22202", "22201", "22198", "22197", "22155", "22150", "22146", "22124", "22115", "22112", "22098", "22096", "22364", "22079", "22245", "22243", "22059", "22058", "22055", "22053", "22052", "22047", "22046", "22043", "22042", "22040", "22077", "22078", "22317", "22029", "22026", "22021", "22167_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "Russell Blvd & Sycamore Ln (WB)", "Russell Blvd & Arthur St (WB)", "Arlington Blvd & Bucklebury Rd (NB)", "Arlington Blvd & Calaveras Ave (NB)", "Arlington Blvd & Shasta Dr (NB)", "Arlington Blvd & Cabot St (NB)", "Arlington Blvd & Lake Blvd (NB)", "Lake Blvd & Wood Circle (NB)", "Lake Blvd & Covell Blvd (NB)", "Covell Blvd & West Area Bike Path (EB)", "Covell Blvd & Denali Dr (EB)", "Covell Blvd & Shasta Dr (EB)", "Covell Blvd & Sycamore Ln (EB)", "Anderson Rd & Hanover Dr (SB)", "Villanova Dr & Anderson Rd (EB)", "14th St & Oak St (EB)", "14th St & B St (EB)", "F St & 14th St (NB)", "F St & Covell Blvd (NB)", "Covell Blvd & J St (EB)", "Covell Blvd & Pole Line Rd (EB)", "Covell Blvd & Wright Blvd (EB)", "Covell Blvd & Alhambra Dr (EB)", "Covell Blvd & Mace Blvd (EB)", "Mace Blvd & 2nd St (SB)", "Mace Blvd & Chiles Rd (SB)", "Cowell Blvd & Sunrise (WB)", "Cowell Blvd & Ensenada Dr (WB)", "Cowell Blvd & La Vida Way (WB)", "Cowell Blvd & Ohlone St (WB)", "Drummond Ave & Cowell (SB)", "Drummond Ave & Lillard Dr (SB)", "Lillard Dr & Evans Ct (WB)", "Lillard Dr & Farragut Cir (WB)", "Pole Line Rd & Cowell Blvd (NB)", "5th St & Pole Line Rd (WB)", "5th St & Davis PW Corp Yard (WB)", "5th Street & L Street (WB)", "5th St & I St (WB)", "5th St & D St (WB)", "Russell Blvd & A St (WB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}}
    },
    "T":   {"Directions:": ["To Davis High","From Davis High"],
        "Stops" : {"StopsIN": {"StopID": ["22125", "22148", "22371", "22372", "22249", "22294", "22261", "22250", "22291", "22067", "22293", "22235", "22066", "22243", "22061", "22496", "22344", "22343", "22063", "22064", "22058", "22055", "22052", "22047", "22046", "22043", "22042", "22038", "22036", "22034", "22242", "22003", "22001_ar"], "StopNames":["14th St & Davis HS (WB)", "Oak Ave & 14th St (SB)", "J St & Drexel Dr (NB)", "J St & Menlo Dr (NB)", "Moore Blvd & Pole Line Rd (EB)", "Moore Blvd & Rockwell (EB)", "Moore Blvd & Raphael (EB)", "Moore Blvd & Pollock (EB)", "Alhambra Dr & Loyola Dr (EB)", "Alhambra Dr & 5th St (EB)", "Alhambra & 5th/Verona (EB)", "Alhambra Dr & Arroyo Ave (EB)", "Alhambra Dr & Mace Blvd (EB)", "Mace Blvd & 2nd St (SB)", "Chiles Rd & Mace Blvd (EB)", "Glide Dr & El Cemonte Ave (EB)", "Glide Dr & Schmeiser Ave (EB)", "Cowell Blvd & Schmeiser Ave (WB)", "Cowell Blvd & El Cemonte Ave (WB)", "Cowell Blvd & Mace Blvd (WB)", "Cowell Blvd & Sunrise (WB)", "Cowell Blvd & Ensenada Dr (WB)", "Cowell Blvd & Ohlone St (WB)", "Drummond Ave & Cowell (SB)", "Drummond Ave & Lillard Dr (SB)", "Lillard Dr & Evans Ct (WB)", "Lillard Dr & Farragut Cir (WB)", "Cowell Blvd & Valdora St (WB)", "Cowell Blvd & Drew Ave (WB)", "Cowell Blvd & Research Park S Dr (WB)", "Richards Blvd & Olive Dr (NB)", "1st St & D St (WB)", "Hutchison Drive & Old Davis Road (WB)"]}, "StopsOUT":{"StopID": ["22000", "22002", "22004", "22035", "22037", "22041", "22297", "22174", "22254", "22255", "22051", "22054", "22056", "22057", "22172", "22497", "22498", "22358", "22359", "22352", "22244", "22299", "22236", "22973", "22290", "22374", "22376", "22375", "22099", "22100", "22314_ar"], "StopNames":["Hutchison Dr & Old Davis Road (EB)", "1st St & C St (EB)", "Richards Blvd & Olive Dr (SB)", "Cowell Blvd & Research Park S Dr (EB)", "Cowell Blvd & Drew Ave (EB)", "Cowell Blvd & Valdora St (EB)", "Lillard Dr & Cowell Blvd (EB)", "Lillard Dr & Evans Ct (EB)", "Lillard & Drummond (EB)", "Drummond & Albany (NB)", "Cowell Blvd & Ohlone St (EB)", "Cowell Blvd & La Vida (EB)", "Cowell Blvd & Ensenada Dr (EB)", "Cowell Blvd & Sunrise Ct (EB)", "Cowell Blvd & Mace Blvd (EB)", "Cowell Blvd & El Cemonte Ave (EB)", "Schmeiser Ave & Cowell Blvd (NB)", "Glide Dr & Schmeiser Ave (WB)", "Glide Dr & El Cemonte Ave (WB)", "Chiles Rd & Mace Blvd (WB)", "Mace Blvd & 2nd St (NB)", "Alhambra & Atlantis / Arroyo (WB)", "Alhambra Dr & Atlantis / Carcia (WB)", "Alhambra Dr & 5th St (WB)", "Alhambra Dr & Loyola Dr (WB)", "Moore & Sargent (WB)", "Moore Village (WB)", "Moore & Pole Line Rd (WB)", "J St & Menlo Dr (SB)", "J St & Drexel Dr (SB)", "Oak & 14th Street (NB)"]}}
    },
    "S":    {"Directions:": ["To Davis High","From Davis High"],
        "Stops" : {"StopsIN": {"StopID": ["22100", "22314", "22145", "22369", "22370", "22368", "22367", "22366", "22365", "22196", "22378", "22386", "22384", "22382", "22380", "22212", "22209", "22207", "22373", "22387_ar"], "StopNames":["J St & Drexel Dr (SB)", "Oak & 14th Street (NB)", "Oak Ave & Covell (NB)", "F St & Bueno (NB)", "F St & Faro (NB)", "Anderson & Sandpiper (WB)", "Anderson & Oriole (SB)", "Anderson & Catalina (SB)", "Anderson & Alvarado (SB)", "Covell Blvd & Sycamore Ln (WB)", "Shasta & Covell (SB)", "Shasta & Rio Grande (SB)", "Shasta & Hampton (WB)", "Shasta & El Capitan (WB)", "Shasta & Denali (WB)", "Arlington Blvd & Shasta Dr (NB)", "Arlington Blvd & Cabot St (NB)", "Arlington Blvd & Lake Blvd (NB)", "Lake Blvd & Westlake Plaza (SB)", "Lake Blvd & Portage Bay (SB)"]}, "StopsOUT":{"StopID": ["22229", "22226", "22227", "22228", "22208", "22210", "22379", "22381", "22383", "22385", "22198", "22197", "22131", "22130", "22129", "22128", "22127", "22312", "22313", "22148", "22371_ar"], "StopNames":["Russell Blvd & Arlington Farm (WB)", "Lake Blvd & Portage Bay (NB)", "Lake Blvd & Salem Ave (NB)", "Lake Blvd & Westlake Plaza (NB)", "Arlington Blvd & Lake Blvd (SB)", "Arlington Blvd & Cabot St (SB)", "Shasta & Denali (EB)", "Shasta & El Capitan (EB)", "Shasta & Hampton (EB)", "Shasta & Rio Grande (NB)", "Covell Blvd & Shasta Dr (EB)", "Covell Blvd & Sycamore Ln (EB)", "Anderson Rd & Bianco (NB)", "Anderson Rd & Valencia (NB)", "Anderson & Oriole (NB)", "Anderson & Sandpiper (EB)", "F Street & Grande (SB)", "F Street & Faro (SB)", "F Street & Bueno (SB)", "Oak Ave & 14th St (SB)", "J St & Drexel Dr (NB)"]}}
    },
    "V":    {"Directions:": ["Inbound to UCD Silo","Outbound to West Village"],
        "Stops" : {"StopsIN": {"StopID": ["22305", "22304", "22289", "22287", "22240", "22173", "22256_ar"], "StopNames":["Tilia Loop & West Bike Path (EB)", "Tilia & Celadon (EB)", "West Village Sq & Community College (SB)", "Hutchison & Sage (SB)", "Hutchison Dr & Health Sci Drive (EB)", "Hutchison Dr & Bioletti Way (EB)", "Silo Terminal & Center Island (WB)"]}, "StopsOUT":{"StopID": ["22272", "22178", "22286", "22288", "22305_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "Russell Blvd & Sycamore Ln (WB)", "Hutchison & Sage (NB)", "West Village Sq & Town Square (NB)", "Tilia Loop & West Bike Path (EB)"]}}
    },
    "W":    {"Directions:": ["Inbound to UCD Silo","Outbound to Drummond"],
        "Stops" : {"StopsIN": {"StopID": ["22174", "22254", "22255", "22045", "22038", "22036", "22034", "22242", "22003", "22001", "22168", "22257_ar"], "StopNames":["Lillard Dr & Evans Ct (EB)", "Lillard & Drummond (EB)", "Drummond & Albany (NB)", "Cowell Blvd & Halsey Cir (WB)", "Cowell Blvd & Valdora St (WB)", "Cowell Blvd & Drew Ave (WB)", "Cowell Blvd & Research Park S Dr (WB)", "Richards Blvd & Olive Dr (NB)", "1st St & D St (WB)", "Hutchison Drive & Old Davis Road (WB)", "Hutchison & Shields Library (WB)", "Silo Terminal & Center Island (EB)"]}, "StopsOUT":{"StopID": ["22257", "22169", "22000", "22002", "22004", "22035", "22037", "22041", "22297", "22174_ar"], "StopNames":["Silo Terminal & Center Island (EB)", "Hutchison Dr & Art Building (EB)", "Hutchison Dr & Old Davis Road (EB)", "1st St & C St (EB)", "Richards Blvd & Olive Dr (SB)", "Cowell Blvd & Research Park S Dr (EB)", "Cowell Blvd & Drew Ave (EB)", "Cowell Blvd & Valdora St (EB)", "Lillard Dr & Cowell Blvd (EB)", "Lillard Dr & Evans Ct (EB)"]}}
    },
    "X":    {"Directions:": ["Inbound to UCD MU","Outbound to Tercero"],
        "Stops" : {"StopsIN": {"StopID": ["22284", "22175", "22167_ar"], "StopNames":["Dairy Road & Tercero (SB)", "La Rue Rd & Orchard (NB)", "Memorial Union Terminal Arrival & Howard Way (NB)"]}, "StopsOUT":{"StopID": ["22167", "22176", "22310", "22269", "22284_ar"], "StopNames":["Memorial Union Terminal Arrival & Howard Way (NB)", "La Rue Rd & Orchard (SB)", "La Rue & Aggie Stadium (NB)", "Dairy Rd & La Rue Rd (SB)", "Dairy Road & Tercero (SB)"]}}
    },
    "Z":    {"Directions:": ["Inbound to UCD MU","Outbound to Target"],
        "Stops" : {"StopsIN": {"StopID": ["22282", "22326", "22283", "22071", "22072", "22074", "22077", "22078", "22032", "22030", "22012", "22009", "22013", "22021", "22167_ar"], "StopNames":["2nd St. & Target Drive (WB)", "2nd Street & Cousteau Place (WB)", "Pena  & 2nd St. (NB)", "5th St & San Rafael St (WB)", "5th St & Cantrill (WB)", "5th St & Post Office / Pole Line Rd (WB)", "5th St & Pole Line Rd (WB)", "5th St & Davis PW Corp Yard (WB)", "Russell Blvd & A St (WB)", "Memorial Union Terminal Arrival & Howard Way (NB)", "L St & 425 (SB)", "3rd St & K St (WB)", "H St Alley & 2nd St (SB)", "2nd St & E St (WB)", "B St & 4th St (NB)"]}, "StopsOUT":{"StopID": ["22272", "22025", "22028", "22319", "22076", "22075", "22073", "22234", "22237", "22070", "22300", "22067", "22235", "22066", "22243", "22282_ar"], "StopNames":["Memorial Union  & Main Island (NB)", "5th St & D St (EB)", "5th St & G St (EB)", "5th Street & K Street (EB)", "5th St & Pole Line Rd (EB)", "5th St & Post Office / Pole Line (EB)", "5th St & Cantrill  (EB)", "5th St & Pena Dr (EB)", "5th St & Spafford St (EB)", "5th St & Windmere Apts. (EB)", "5th Street & Verona Terrace (EB)", "Alhambra Dr & 5th St (EB)", "Alhambra Dr & Arroyo Ave (EB)", "Alhambra Dr & Mace Blvd (EB)", "Mace Blvd & 2nd St (SB)", "2nd St. & Target Drive (WB)"]}}
    }
}
};