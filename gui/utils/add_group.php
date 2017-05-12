<?php
include('dblinker.php');
try{
	$conn = dblink();
	$obj = json_decode($_POST["x"], false);
	$id_list = implode(',',$obj->id);
	$signal_names = implode(',',$obj->signalNames);
	
	$all_signals_ungrouped = 1;
	
	foreach($obj->id as $signal){
		$stmt1 = $conn->prepare("SELECT * FROM signals WHERE id = :signal");
		$stmt1->bindParam(':signal', $signal);
		$stmt1->execute();
		$data = $stmt1->fetch(PDO::FETCH_ASSOC);
		
		if($data["grouped"]==1){
			$all_signals_ungrouped = 0;
			break;
		}
	}
	
	if($all_signals_ungrouped==1){
		$stmt2 = $conn->prepare("INSERT INTO signalgroups (name,signals,signalnames) VALUES (:name, :signals, :signalnames)");
		$stmt2->bindParam(':name', $obj->name);
		$stmt2->bindParam(':signals', $id_list);
		$stmt2->bindParam(':signalnames', $signal_names);
		$stmt2->execute();
		
		foreach($obj->id as $signal){
			$stmt3 = $conn->prepare("UPDATE signals SET grouped = 1 WHERE id = :signal");
			$stmt3->bindParam(':signal', $signal);
			$stmt3->execute();
		}
		
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