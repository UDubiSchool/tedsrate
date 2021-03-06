<?php
    require_once "session_inc.php";
	require_once "header.inc.php";
	require_once "dbconnect.php";

	//set up some SQL statements
	$sql["language"] = 'SELECT * from language';

	try {
		$dbq = db_connect();

?>

<div id="wrapper">
	<?php
     	include "nav_part.inc.php";
     ?>

	<div id="page-wrapper">
		<h1>Scenario Information</h1>
		<table id="pjt_scenario_tbl" class="table table-bordered table-hover table-striped tablesorter">
			<thead>
              	<tr>
	                <th>Name</th>
	               	<th>Description</th>
	               	<th>Language</th>
              	</tr>
            </thead>
			<tbody>

				<?php
					$pre_result = $dbq->prepare("SELECT scenarioName, scenarioDescription, languageName from scenario JOIN language ON language.languageID = scenario.languageID");
					$pre_result->execute();
					while ($row = $pre_result->fetch(PDO::FETCH_ASSOC)) {
						// print_r($row);
						// $languageID = $row['scenarioLanguageID'];
						// $lan_re = mysql_query("select languageTitle from languages where languageID = ".(string)$row['scenarioLanguageID']);
						// print($lan_re);
						printf('<tr><td>%s</td><td>%s</td><td>%s</td></tr>', $row['scenarioName'],$row['scenarioDescription'] ? $row['scenarioDescription'] : "No information provided", $row['languageName']);
					}
				?>
			</tbody>
		</table>

		<!-- adding new action -->
		<div class="action_wrapper">
			<div class="center-block"><button class="toggle btn btn-default">Add New Scenario</button></div>
			<div class="clearfix"></div>
			<div class="toggle-content center-block" style="display:none;">
				<form id="addProject" name="addProject" action="adminproc.php" method="post">
					<h2>Add Project Scenario(s)</h2>
<!--					<a class="addmore" href="#" id="addMoreScenarios">Add Another Scenario</a>-->
					<div id="scenarios" class="parent_contain">
						<div class="addScenario">
							<label for="scenarioName[]">Scenario Title</label><input class="input-text notEmpty" type="text" name="scenarioName[]" />
							<label for="scenarioDesc[]">Scenario Description</label><input class="input-text notEmpty" type="text" name="scenarioDesc[]" />
						</div>
					</div>
					<input type="hidden" name="source" value="scenario" class="notEmpty">
					<input class="btn btn-success" type="submit">
				</form>
			</div>
		</div>
	</div>

    <?php
    // logout form
    require_once "logout_form.inc.php";
    ?>

</div>

<?php
		//close connection
		$dbq = NULL;
	} catch (PDOException $e) {
	     print ("getMessage(): " . $e->getMessage () . "\n");
	}
?>


<!-- include js files -->
	<script src="js/admin.js"></script>
<?php
     	$active = "Scenario";
     	include "footer.inc.php";
?>