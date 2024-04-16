import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TransgenderIcon from "@mui/icons-material/Transgender";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MessageIcon from "@mui/icons-material/Message";

const AdminDatabaseCard = ({ user, handleToggleActive, handleDeleteUser }) => {
  // Function to toggle the active status of the user
  const toggleActiveStatus = () => {
    handleToggleActive(user._id, user.isActive);
  };

  // Function to delete the user
  const deleteUser = () => {
    handleDeleteUser(user._id);
  };


  const scrollableAccordionDetailsStyle = {
    maxHeight: '200px', // Set a maximum height that fits your design
    overflowY: 'auto', // Enable vertical scrolling
  };
  

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 600,
        my: 2,
        mx: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "visible",
        boxShadow: 3,
      }}
    >
      <CardContent
        sx={{
          overflowY: "auto",
          maxHeight: 600,
          "& > :not(style) + :not(style)": { mt: 2 },
        }}
      >
        <Typography gutterBottom variant="h5" component="div">
          {user.profile.firstName}
        </Typography>

        {/* User details accordion */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-user-details-content"
            id="panel-user-details-header"
          >
            <Typography>User Details</Typography>
          </AccordionSummary>
          <AccordionDetails style={scrollableAccordionDetailsStyle}>
            <Grid container direction="column" spacing={1}>
              {/* Email */}
              <Grid item container alignItems="center">
                <EmailIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Email: {user.profile.email}
                </Typography>
              </Grid>

              {/* Birthdate */}
              <Grid item container alignItems="center">
                <CakeIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Birthdate:{" "}
                  {new Date(user.profile.birthdate).toLocaleDateString()}
                </Typography>
              </Grid>

              {/* Rating */}
              <Grid item container alignItems="center">
                <StarBorderIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Rating: {user.profile.rating}
                </Typography>
              </Grid>

              {/* Gender */}
              <Grid item container alignItems="center">
                <TransgenderIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Gender: {user.profile.gender}
                </Typography>
              </Grid>

              {/* Time to Play */}
              <Grid item container alignItems="center">
                <TimerIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Time to Play: {user.profile.timeToPlay}
                </Typography>
              </Grid>

              {/* Selected Days */}
              <Grid item container alignItems="center">
                <CalendarTodayIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Selected Days: {user.profile.selectedDays}
                </Typography>
              </Grid>

              {/* Backup Email */}
              <Grid item container alignItems="center">
                <AlternateEmailIcon color="action" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Backup Email: {user.profile.backupEmail}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ShoppingCartIcon color="action" />
            <Typography sx={{ ml: 1 }}>Cart Items</Typography>
          </AccordionSummary>

          <AccordionDetails style={scrollableAccordionDetailsStyle}>
            {user.cart && user.cart.items && user.cart.items.length > 0 ? (
              user.cart.items.map((item, index) => (
                <Grid container key={index} spacing={1} alignItems="center">
                  <Grid item xs={12}>
                    <Typography>
                      Name: {item.name} - Quantity: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Price: ${item.price}</Typography>
                  </Grid>
                  {item.imageUrl && (
                    <Grid item xs={12}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </Grid>
                  )}
                </Grid>
              ))
            ) : (
              <Typography>No items in cart.</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <MessageIcon color="action" />
            <Typography sx={{ ml: 1 }}>Messages</Typography>
          </AccordionSummary>
          <AccordionDetails style = {scrollableAccordionDetailsStyle}>
            {user.messages && user.messages.length > 0 ? (
              user.messages.map((message) => (
                <Typography key={message._id}>{message.content}</Typography>
              ))
            ) : (
              <Typography>No messages.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2, mb: 2 }}>
        <Grid item>
          <Button
            startIcon={user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
            onClick={toggleActiveStatus}
            color={user.isActive ? "secondary" : "primary"}
          >
            {user.isActive ? "Deactivate" : "Activate"}
          </Button>
        </Grid>
        <Grid item>
          <Button startIcon={<DeleteIcon />} onClick={deleteUser} color="error">
            Delete
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AdminDatabaseCard;
