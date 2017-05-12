<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	$id_list = implode(',',$obj->id);
	$signal_names = implode(',',$obj->signalNames);
	
	$all_signals_ungrouped = 0;
	$stmt1 = $conn->query("SELECT * FROM signals");
	while($data = $stmt1->fetch(PDO::FETCH_ASSOC)){
		if($data["grouped"]==1){
			$all_signals_ungrouped = 1;
			break;
		}
	}
	if($all_signals_ungrouped==0){
		$stmt2 = $conn->prepare("INSERT INTO signalgroups (name,signals,signalnames) VALUES (:name, :signals, :signalnames)");
		$stmt2->bindParam(':name', $obj->name);
		$stmt2->bindParam(':signals', $id_list);
		$stmt2->bindParam(':signalnames', $signal_names);
		$stmt2->execute();
		
		echo "success";
	}else{
		echo "signaloccupied";
	}
	
	
	
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>